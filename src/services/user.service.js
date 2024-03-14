import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import HomeOwner from "../models/homeOwner.model.js";
import { deleteFile } from "../utils/file.utils.js";
import Employee from "../models/employee.model.js";
import { calculateRemainingDays, dateCompare } from "../utils/date.utils.js";
// get me
const getme = async (userId, role) => {
  let result;
  const date = new Date();
  if (role === "homeowner") {
    result = await HomeOwner.findOne({ user: userId }).populate("user");
  } else if (role === "employee") {
    result = await Employee.findOne({ user: userId }).populate("user");
  }
  const formatedObject = {
    _id: result.user?._id,
    name: result?.name,
    image: result?.image,
    email: result?.user?.email,
    phoneNumber: result?.user?.phoneNumber,
    role: result?.user?.role,
    refferalCode: result?.refferalCode,
    homes: result?.homes,
    trial: result?.user?.trial,
    trialExpirationDate: result?.user?.trialExpirationDate,
    trialStatus: dateCompare(date, result?.user?.trialExpirationDate),
    trialRemainingDate: calculateRemainingDays(
      date,
      result?.user?.trialExpirationDate
    ),
  };
  return formatedObject;
};
// update user profile
const updateMyProfile = async (usermail, userId, role, payload) => {
  const { password, role: clientRole, phoneNumber, email, ...others } = payload;
  console.log(payload);
  const authObj = {
    email,
    phoneNumber,
  };
  const isExistUser = await User.isUserExist(email);
  if (usermail !== email && isExistUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user already exists with this email."
    );
  }
  if (password || clientRole) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "something went wrong. please try again later"
    );
  }
  let findFilePath;
  if (role === "homeowner") {
    findFilePath = await HomeOwner.findOne({ user: userId });
  } else if (role === "employee") {
    findFilePath = await Employee.findOne({ user: userId });
  }
  const session = await mongoose.startSession();
  let result;
  try {
    session.startTransaction();
    if (role === "homeowner") {
      const updateUser = await User.findByIdAndUpdate(userId, authObj, {
        new: true,
        session,
      });
      if (!updateUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to Update User");
      }
      result = await HomeOwner.findOneAndUpdate({ user: userId }, others, {
        new: true,
        session,
      }).populate("user");
      if (!result) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to Update homeOwner"
        );
      }
      if (payload?.image && findFilePath?.image) {
        await deleteFile(findFilePath.image);
      }
    } else if (role === "employee") {
      const updateUser = await User.findByIdAndUpdate(userId, authObj, {
        new: true,
        session,
      });

      if (!updateUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to Update User");
      }
      result = await Employee.findOneAndUpdate({ user: userId }, others, {
        new: true,
        session,
      }).populate("user");
      if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to Update emplooye");
      }
      if (payload?.image && findFilePath?.image) {
        await deleteFile(findFilePath.image);
      }
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const userServices = {
  getme,
  updateMyProfile,
};
export default userServices;
