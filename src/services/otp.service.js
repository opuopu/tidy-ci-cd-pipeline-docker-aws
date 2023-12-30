import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import Otp from "../models/Otp.model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "../models/user.model.js";
import { createToken } from "../utils/auth.utils.js";
const createAnOtpIntoDB = async (userId, email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 3600000);
  const decryptOtp = await bcrypt.hash(
    otp.toString(),
    Number(config.bcrypt_salt_rounds)
  );
  const otpObj = {
    userId,
    email,
    otp: decryptOtp,
    expiresAt,
  };
  console.log(otpObj);
  const result = await Otp.create(otpObj);
  if (!result) {
    throw new AppError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "something went wrong. otp not generated!"
    );
  }
  const sendCode = await sendEmail(
    email,
    otp,
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
  if (!sendCode) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to sent otp. please try again"
    );
  }
  // should refactor this code at home
  const accessToken = createToken();
};

const verifyOtp = async (payload) => {
  const { userId, verificationCode } = payload;
  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, "user information not found");
  }
  if (!verificationCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "plese give verification code");
  }
  const UserOtpRecord = await Otp.findOne({ userId: userId });
  if (UserOtpRecord.length <= 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user reocord not exist. please sign up again."
    );
  }
  const { expiresAt, otp } = UserOtpRecord;
  if (expiresAt < Date.now()) {
    await Otp.deleteOne({ userId: userId, expiresAt: expiresAt });
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "otp has expired. please resend it"
    );
  } else {
    const isOtpMatched = Otp.isOtpMatched(verificationCode, otp);
    if (!isOtpMatched)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "otp did not match.plese try again"
      );
    await User.updateOne({ _id: userId }, { verified: true });
    await Otp.deleteOne({ userId: userId, expiresAt: expiresAt });
  }
};
const otpServices = {
  createAnOtpIntoDB,
  verifyOtp,
};
export default otpServices;
