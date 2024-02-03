import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import Otp from "../models/Otp.model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { generateOtp } from "../utils/OtpGenerator.js";
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
const veriFySignupOtp = async ({ email, otp }) => {
  // check if user is already verified
  const isUserVerfied = await User.findOne({ email });
  if (isUserVerfied?.verified) {
    await Otp.findOneAndDelete({
      $and: [{ email: email }, { type: "signupVerification" }],
    });
    throw new AppError(httpStatus.CONFLICT, "User Account Already Verified");
  }
  // check is exist otp
  const isExistOtp = await Otp.isExistOtp(email, "signupVerification");
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
    await Otp.deleteOne({ email: email, expiresAt: expiresAt });
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp has expired. please resend it"
    );
  }
  // check is otp matched
  const isOtpMatched = await Otp.isOtpMatched(otp, isExistOtp?.otp);

  if (!isOtpMatched)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp did not match.plese try again"
    );
  let result;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await User.findOneAndUpdate(
      { email: email },
      { verified: true },
      { new: true, session }
    );
    result = await Otp.findByIdAndDelete(isExistOtp?._id, { session });
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
  return result;
};

const otpServices = {
  createAnOtpIntoDB,
  veriFySignupOtp,
};
export default otpServices;
