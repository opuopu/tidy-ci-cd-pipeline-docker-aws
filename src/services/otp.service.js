import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import Otp from "../models/Otp.model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "../models/user.model.js";

import mongoose from "mongoose";
const createAnOtpIntoDB = async (email, type) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 3600000);
  const decryptOtp = await bcrypt.hash(
    otp.toString(),
    Number(config.bcrypt_salt_rounds)
  );
  const otpObj = {
    email,
    type,
    otp: decryptOtp,
    expiresAt,
  };
  console.log(otpObj);
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

  // should refactor this code at home
};
const verifyOtp = async (email, payload) => {
  const { verificationCode, type } = payload;

  const isExistOtp = await Otp.isExistOtp(email, type);

  if (!isExistOtp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "otp information not found. please resend it!"
    );
  }
  if (!verificationCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "plese give verification code");
  }
  const { expiresAt } = isExistOtp;
  const isOtpExpired = await Otp.isOtpExpired(email, type);
  if (isOtpExpired) {
    await Otp.deleteOne({ email: email, expiresAt: expiresAt });
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp has expired. please resend it"
    );
  }
  const isOtpMatched = await Otp.isOtpMatched(
    verificationCode,
    isExistOtp?.otp
  );

  if (!isOtpMatched)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp did not match.plese try again"
    );
  // transaction and rollback
  let result;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await User.updateOne({ email: email }, { verified: true }, { session });
    if (type === "signupVerification") {
      result = await Otp.findOneAndDelete(
        { email: email, expiresAt: expiresAt, type: type },
        { session }
      );
    } else if (type === "forgotPassword") {
      result = await Otp.findByIdAndUpdate(
        isExistOtp?._id,
        {
          $set: {
            verificationStatus: true,
          },
        },
        { new: true }
      );
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
  return null;
};

const otpServices = {
  createAnOtpIntoDB,
  verifyOtp,
};
export default otpServices;
