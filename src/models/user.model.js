import { config } from "dotenv";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
  name: {
    type: String,
  },
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
    required: [true, "password is required"],
  },
  profileImage: {
    publicUrl: {
      type: String,
    },
    path: {
      type: String,
    },
  },
});
userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});
userSchema.statics.isUserExist = async function (email) {
  return await User.findOne({ email }).select("+password");
};
userSchema.statics.isPsswordMatched = async function (
  plainPassword,
  hashPassword
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};
export const User = model("user", userSchema);
