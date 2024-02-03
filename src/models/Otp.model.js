import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "./user.model.js";
const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
    },
    otp: {
      type: String,
      required: [true, "otp is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "expired at is required"],
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["forgotPassWordVerification", "signupVerification"],
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.statics.isOtpMatched = async function (plainOtp, HasedOtp) {
  return await bcrypt.compare(plainOtp, HasedOtp);
};
otpSchema.statics.isExistOtp = async function (email, type) {
  const isExistOtp = await Otp.findOne({
    $and: [{ email: email }, { type: type }],
  });
  return isExistOtp;
};
otpSchema.statics.isOtpExpired = async function (expiresAt) {
  return expiresAt < new Date() ? true : false;
};
otpSchema.statics.deleteOtp = async function (email, type, expiresAt) {
  return await Otp.deleteOne({
    $and: [{ email: email }, { type: type }, { expiresAt: expiresAt }],
  });
};
const Otp = model("Otp", otpSchema);
export default Otp;
