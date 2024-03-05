import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import Otp from "../models/Otp.model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { generateOtp } from "../utils/OtpGenerator.js";
import { createToken, generateRefferalCode } from "../utils/auth.utils.js";
import HomeOwner from "../models/homeOwner.model.js";
const createAnOtpIntoDB = async ({ email, type }) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 3600000);
  const decryptOtp = await bcrypt.hash(otp, Number(config.bcrypt_salt_rounds));
  const otpObj = {
    email,
    type,
    otp: decryptOtp,
    expiresAt,
  };
  const result = await Otp.create(otpObj);
  if (!result) {
    throw new AppError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "something went wrong. otp not generated!.please try again!"
    );
  }
  await sendEmail(
    email,
    "Your One-Time Verification Code",
    "Your One-Time Verification Code",
    otp
  );
};
const veriFySignupOtp = async (payload) => {
  // check if user is already verified
  const isUserVerfied = await User.findOne({ email: payload?.email });
  if (isUserVerfied?.verified) {
    await Otp.findOneAndDelete({
      $and: [{ email: payload?.email }, { type: "signupVerification" }],
    });
    throw new AppError(httpStatus.CONFLICT, "User Account Already Verified");
  }
  // check is exist otp
  const isExistOtp = await Otp.isExistOtp(payload?.email, "signupVerification");
  if (!isExistOtp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "otp information not found. please resend it!"
    );
  }
  const { expiresAt } = isExistOtp;
  // check is otp expired
  const isOtpExpired = await Otp.isOtpExpired(expiresAt);
  if (isOtpExpired) {
    await Otp.deleteOne({ email: payload?.email, expiresAt: expiresAt });
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp has expired. please resend it"
    );
  }
  // check is otp matched
  const isOtpMatched = await Otp.isOtpMatched(payload?.otp, isExistOtp?.otp);

  if (!isOtpMatched)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp did not match.plese try again"
    );

  let result;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const authObj = {
      email: payload.email,
      password: payload.password,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
    };

    const createUser = await User.create([authObj], { session });
    if (!createUser[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create user");
    }
    console.log(createUser[0]);
    const homeOwnerObject = {
      name: payload?.name,
      user: createUser[0]?._id,
      refferalCode: generateRefferalCode(),
    };
    const createHomeOwner = await HomeOwner.create([homeOwnerObject], {
      session,
    });
    if (!createHomeOwner[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create user");
    }
    result = await Otp.findByIdAndDelete(isExistOtp?._id, { session });
    const jwtPayload = {
      userId: createUser[0]._id,
      email: createUser[0].email,
      role: createUser[0].role,
      verified: createUser[0].verified,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in
    );

    await session.commitTransaction();
    await session.endSession();
    return {
      user: createUser[0],
      accessToken,
      refreshToken,
    };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const otpServices = {
  createAnOtpIntoDB,
  veriFySignupOtp,
};
export default otpServices;
