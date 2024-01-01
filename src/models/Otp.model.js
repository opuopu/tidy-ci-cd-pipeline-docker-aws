import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { User } from "./user.model.js";
const otpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
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
    expiresStatus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["forgotPassword", "signupVerification"],
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.statics.isOtpMatched = async function (plainOtp, HasedOtp) {
  console.log(plainOtp, HasedOtp);
  return await bcrypt.compare(plainOtp, HasedOtp);
};
otpSchema.statics.isExistOtp = async function (userId, type) {
  const isExistOtp = await Otp.findOne({
    $and: [{ userId: userId }, { type: type }],
  });
  return isExistOtp;
};
otpSchema.statics.isOtpExpired = async function (userId, type) {
  const isOtpExpired = await Otp.findOne({
    $and: [
      { userId: userId },
      { type: type },
      { $expr: { $lt: ["$expiresAt", new Date()] } },
    ],
  });

  return isOtpExpired ? true : false;
};

const Otp = model("Otp", otpSchema);
export default Otp;
