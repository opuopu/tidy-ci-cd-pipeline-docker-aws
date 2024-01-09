import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import HomeOwner from "../models/homeOwner.model.js";
import { deleteFile } from "../utils/file.utils.js";
const getme = async (userId, role) => {
  let result;
  if (role === "homeOwner") {
    result = await HomeOwner.findOne({ user: userId }).populate("user");
  } else if (role === "employee") {
    result = await HomeOwner.findOne({ user: userId }).populate("user");
  }

  return result;
};

const updateMyProfile = async (userId, role, file, payload) => {
  const { password, role: clientRole, phoneNumber, email } = payload;
  if (file) {
    payload.profileImage = file;
  }
  if (password || clientRole) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "something went wrong. please try again later"
    );
  }
  const findFilePath = await HomeOwner.findOne({ user: userId });
  if (findFilePath && findFilePath.profileImage?.path) {
    await deleteFile(findFilePath.profileImage?.path);
  }
  const session = await mongoose.startSession();
  let result;

  try {
    session.startTransaction();

    let updateAuthInformation;
    if (phoneNumber || email) {
      updateAuthInformation = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            email: email,
            phoneNumber: phoneNumber,
          },
        },
        { session }
      );
      if (!updateAuthInformation) {
        throw new AppError(httpStatus.BAD_REQUEST, "something went wrong");
      }
    }
    result = await HomeOwner.findOneAndUpdate({ user: userId }, payload, {
      new: true,
      session,
    });
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
  return result;
};
const userServices = {
  getme,
  updateMyProfile,
};
export default userServices;
