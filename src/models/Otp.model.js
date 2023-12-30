import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
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
    exipiresStatus: {
      type: Boolean,
      default: false,
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

const Otp = model("Otp", otpSchema);
export default Otp;
