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
import bcrypt from "bcrypt";

import Employee from "../models/employee.model.js";
import { generateNewEmployeeId } from "../utils/employee.utils.js";
// create homeOwner
const signupHomeOwnerIntoDB = async (payload) => {
  const { email } = payload;
  const user = await User.isUserExist(email);
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user already exist with the same email!"
    );
  }
  await otpServices.createAnOtpIntoDB({
    email,
    type: "signupVerification",
  });
};
// signup employee
const signupEmployeeIntoDb = async (payload) => {
  const { email, password, phoneNumber, needPasswordChange, ...others } =
    payload;
  const id = await generateNewEmployeeId();
  const authObj = {
    email,
    password,
    phoneNumber,
    needPasswordChange: true,
    role: "employee",
    verified: true,
    id: id,
  };
  const user = await User.isUserExist(email);
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Employee already exist with the same email!"
    );
  }
  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();
    result = await User.create([authObj], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Somethign Went Wrong");
    }
    const insertEmployeeDetails = await Employee.create(
      [
        {
          ...others,
          user: result[0]?._id,
          id: id,
        },
      ],
      { session }
    );
    if (!insertEmployeeDetails) {
      throw new AppError(httpStatus.BAD_REQUEST, "Somethign Went Wrong");
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
  return result[0];
};
// signi
const SigninHomeOwner = async (payload) => {
  const { email, password } = payload;
  const user = await User.isUserExist(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email!");
  }
  if (user?.role !== "homeowner") {
    throw new AppError(httpStatus.NOT_FOUND, "you are not authorized!");
  }
  const { password: hasedPassword } = user;
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    hasedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "password do not match!");
  }
  // if (!verified) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "please verify your account first!"
  //   );
  // }

  const { password: newsdfd, ...others } = user.toObject();
  const jwtPayload = {
    userId: user?._id,
    email: user.email,
    role: user.role,
    id: user?.id,
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
    user: others,
    accessToken,
    refreshToken,
  };
};
// signi
const SigninEmployee = async (payload) => {
  const { email, password } = payload;
  const user = await User.isUserExist(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email!");
  }
  if (user?.role !== "employee") {
    throw new AppError(httpStatus.NOT_FOUND, "you are not authorized!");
  }
  const findEmployee = await Employee.findOne({ id: user?.id });
  if (!findEmployee) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email!");
  }
  const { password: hasedPassword } = user;
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    hasedPassword
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "password do not match!");
  }
  // if (!verified) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "please verify your account first!"
  //   );
  // }

  const { password: newsdfd, ...others } = user.toObject();
  const jwtPayload = {
    userId: user?._id,
    email: user.email,
    role: user.role,
    id: user?.id,
    verified: user?.verified,
    homeOwnerId: findEmployee?.homeOwner,
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
    user: others,
    accessToken,
    refreshToken,
  };
};

// refresh token
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

// forget password
const forgotPassword = async ({ email, newPassword, confirmPassword }) => {
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not exist with this email");
  }
  const isOtpVerified = await Otp.findOne({
    email: email,
    type: "forgotPassWordVerification",
  }).sort({ createdAt: -1 });
  if (!isOtpVerified?.verificationStatus) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "confirm password and new password does not match"
    );
  }
  const hasedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await User.findByIdAndUpdate(
      isUserExist?._id,
      {
        password: hasedPassword,
        passwordChangedAt: new Date(),
      },
      { new: true, session }
    );
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "something went wrong. please try again "
      );
    }
    await Otp.deleteMany({ email: email, type: "forgotPassWordVerification" });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  return result;
};

const resetPassword = async (id, payload) => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.checkUserExistById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Information Not Found");
  }

  const isPasswordMatched = await bcrypt.compare(
    isUserExist?.password,
    oldPassword
  );
  console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password Does Not Match");
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "new password and confirm password does not match"
    );
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword, passwordChangedAt: new Date() },
    { new: true }
  );

  return result;
};

const authServices = {
  SigninHomeOwner,
  refreshToken,
  forgotPassword,
  resetPassword,
  signupHomeOwnerIntoDB,
  signupEmployeeIntoDb,
  SigninEmployee,
};
export default authServices;
