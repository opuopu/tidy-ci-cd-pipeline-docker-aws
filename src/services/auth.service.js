import { User } from "../models/user.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import otpServices from "./otp.service.js";
import mongoose from "mongoose";
import {
  createToken,
  generateRefferalCode,
  verifyToken,
} from "../utils/auth.utils.js";
import config from "../config/index.js";
import Otp from "../models/Otp.model.js";
import HomeOwner from "../models/homeOwner.model.js";

// create homeOwner
const signupHomeOwnerIntoDB = async (payload) => {
  const { email } = payload;
  console.log(email);
  const user = await User.isUserExist(email);

  if (user && user?.verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user already exist with the same email!"
    );
  }
  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();
    if (user && !user?.verified) {
      const deleteUser = await User.findOneAndDelete(
        { email: email },
        { session }
      );
      console.log(deleteUser);
      if (!deleteUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "someting went wrong!");
      }
      const deletehomeOwner = await HomeOwner.findOneAndDelete(
        {
          user: user?._id,
        },
        { session }
      );
      if (!deletehomeOwner) {
        throw new AppError(httpStatus.BAD_REQUEST, "someting went wrong!");
      }
    }

    const authObj = {
      email: payload.email,
      password: payload.password,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
    };

    const createnewUser = await User.create([authObj], { session });
    if (!createnewUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create user");
    }

    const finalObj = {
      ...payload,
      user: createnewUser[0]?._id,
      refferalCode: generateRefferalCode(),
    };
    result = await HomeOwner.create([finalObj], { session });
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  setTimeout(async () => {
    await otpServices.createAnOtpIntoDB(email, "signupVerification");
  }, 1000);
  return result[0];
};

const SignInUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.isUserExist(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email!");
  }
  const { password: hasedPassword, verified } = user;
  console.log(user);
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    hasedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "password do not match!");
  }
  if (!verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "please verify your account first!"
    );
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    verified: user.verified,
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
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  const decodeToken = verifyToken(token, config.jwt_refresh_secret);
  if (!verifyToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }
  const { userId, email, verified } = decodeToken;
  const jwtPayload = {
    userId,
    email,
    verified,
  };
  const accessToken = createToken(
    jwtPayload,
    jwt_access_secret,
    jwt_access_expires_in
  );
  return {
    accessToken,
  };
};

const forgotPassword = async (email) => {
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email");
  }
  await otpServices.createAnOtpIntoDB(email, "forgotPassword");
};

const updatePassword = async (email, payload) => {
  const { password } = payload;
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user not exist with this email. please check your email again!"
    );
  }
  const isOtpVerified = await Otp.findOne({
    $and: [
      { email: email },
      { type: "forgotPassword" },
      { verificationStatus: true },
    ],
  });
  if (!isOtpVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "something went wrong. please send otp again!"
    );
  }
  isUserExist.password = password;
  const result = await isUserExist.save();
  if (result) {
    await Otp.deleteOtp(email, isOtpVerified?.type, isOtpVerified?.expiresAt);
  }
  return result;
};

const resetPassword = async (id, payload) => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await User.checkUserExistById(id);
  console.log(isUserExist);
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found. Please check the provided ID."
    );
  }

  const isPasswordMatched = await User.isPasswordMatched(
    oldPassword,
    isUserExist?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Old password does not match Please verify and try again."
    );
  }
  isUserExist.password = newPassword;
  const result = await isUserExist.save();
  return result;
};
const authServices = {
  SignInUser,
  refreshToken,
  forgotPassword,
  updatePassword,
  resetPassword,
  signupHomeOwnerIntoDB,
};
export default authServices;
