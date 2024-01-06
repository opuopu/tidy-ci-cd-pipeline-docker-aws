import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/index.js";
const userSchema = new Schema(
  {
    phoneNumber: {
      type: Number,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      select: 0,
      required: [true, "password is required"],
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["homeOwner", "employee"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
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
