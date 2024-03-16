import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { calculateRemainingDays, dateCompare } from "../utils/date.utils.js";
const userSchema = new Schema(
  {
    phoneNumber: {
      type: Number,
      // required: [true, "phone number is required"],
      // unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    id: {
      type: String,
      required: [true, "id is required"],
      // unique: true,
    },
    password: {
      type: String,
      select: 0,
      required: [true, "password is required"],
    },
    passwordChangedAt: {
      type: Date,
    },
    needPasswordChange: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["homeowner", "employee"],
      required: [true, "role is required"],
    },

    verified: {
      type: Boolean,
      default: true,
    },
    trial: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    trialExpirationDate: {
      type: Date,
      required: [true, "trial expiration date is required"],
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
  }
);
userSchema.virtual("trialStatus").get(function () {
  const currentDate = new Date();
  const trialExpirationDate = this.trialExpirationDate;
  return dateCompare(currentDate, trialExpirationDate);
});
userSchema.virtual("trialRemainingDate").get(function () {
  const currentDate = new Date();
  const trialExpirationDate = this.trialExpirationDate;
  return calculateRemainingDays(currentDate, trialExpirationDate);
});
userSchema.pre("save", async function (next) {
  const user = this; // doc

  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});
userSchema.statics.isUserExist = async function (email) {
  return await User.findOne({ email: email }).select("+password");
};
userSchema.statics.isDuplicatePhone = async function (phoneNumber) {
  return await User.findOne({ phoneNumber: phoneNumber });
};
userSchema.statics.checkUserExistById = async function (id) {
  return await User.findOne({ _id: id }).select("+password");
};
userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashPassword
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const User = model("User", userSchema);
