import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import { User } from "../models/user.model.js";
import HomeOwner from "../models/homeOwner.model.js";

const getme = async (userId, role) => {
  let result;
  if (role === "homeOwner") {
    result = await HomeOwner.findOne({ user: userId }).populate("user");
  } else if (role === "employee") {
  }

  return result;
};

const updateMyProfile = async (userId, role, payload) => {
  const { password, role: clientRole } = payload;
  if (password && clientRole) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "something went wrong. please try again later"
    );
  }
  const result = await User.findOneAndUpdate(
    { _id: userId, role: role },
    payload,
    {
      new: true,
    }
  );
  return result;
};
const userServices = {
  getme,
  updateMyProfile,
};
export default userServices;
