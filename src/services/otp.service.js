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
import { generateNewHomeOwnerId } from "../utils/homeowner.utils.js";
import { nextFiveDay } from "../utils/date.utils.js";

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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Otp.deleteMany({ email: email, type: type }, { session });

    const result = await Otp.create(otpObj);
    if (!result) {
      throw new AppError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "something went wrong. otp not generated!.please try again!"
      );
    }
  } catch (err) {}
  await sendEmail(
    email,
    "Your One-Time Verification Code",
    "Your One-Time Verification Code",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <h2 style="color: #3498db; text-align: center;">One-Time Verification Code</h2>
      <p style="font-size: 16px;">Your one-time verification code is:</p>
      <p style="font-size: 24px; font-weight: bold; color: #2ecc71; text-align: center;">${otp}</p>
      <p style="font-size: 16px;">This code is valid for 1 hour.</p>
      <p style="font-size: 14px; color: #888;">Please do not share this code with anyone for security reasons.</p>
    </div>
  `
  );
};
const veriFySignupOtp = async (payload) => {
  console.log(payload);
  // check is exist otp
  const date = new Date();
  const isExistOtp = await Otp.findOne({
    email: payload?.email,
    type: "signupVerification",
  }).sort({ createdAt: -1 });

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

  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();
    const id = await generateNewHomeOwnerId();
    console.log(id);
    const authObj = {
      email: payload.email,
      password: payload.password,
      role: payload.role,
      id: id,
      trialExpirationDate: nextFiveDay(date),
    };
    const createUser = await User.create([authObj], { session });
    if (!createUser[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create user");
    }
    const homeOwnerObject = {
      name: payload?.name,
      user: createUser[0]?._id,
      refferalCode: generateRefferalCode(),
      image: "/uploads/profile/defaultProfile.png",
      id: id,
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
      id: id,
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
    const formatedObject = {
      email: createUser[0]?.email,
      phoneNumber: createUser[0]?.phoneNumber ?? null,
      refferalCode: createHomeOwner[0]?.refferalCode,
      homes: createHomeOwner[0]?.homes,
      name: createHomeOwner[0]?.name,
    };

    await session.commitTransaction();
    await session.endSession();

    return {
      user: formatedObject,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const verifyForgetPasswordOtp = async (payload) => {
  const findOtp = await Otp.findOne({
    email: payload?.email,
    type: "forgotPassWordVerification",
  }).sort({ createdAt: -1 });
  if (!findOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp information not found.please resend it"
    );
  }

  const { expiresAt } = findOtp;
  // check is otp expired
  const isOtpExpired = await Otp.isOtpExpired(expiresAt);
  if (isOtpExpired) {
    await Otp.deleteOne({
      email: payload?.email,
      type: "forgotPassWordVerification",
    });
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp has expired. please resend it"
    );
  }
  // check is otp matched
  const isOtpMatched = await Otp.isOtpMatched(payload?.otp, findOtp?.otp);
  if (!isOtpMatched)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp did not match.plese try again"
    );

  const updateOtp = await Otp.findByIdAndUpdate(
    findOtp?._id,
    {
      $set: {
        verificationStatus: true,
      },
    },
    { new: true }
  );
  if (!updateOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "something went wrong");
  }
  return updateOtp;
};

const otpServices = {
  createAnOtpIntoDB,
  veriFySignupOtp,
  verifyForgetPasswordOtp,
};
export default otpServices;
