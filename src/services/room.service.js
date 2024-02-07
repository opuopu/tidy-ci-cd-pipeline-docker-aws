import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Room from "../models/room.model.js";
import mongoose from "mongoose";
import Home from "../models/home.model.js";
const inserRoomIntoDB = async (payload) => {
  const session = await mongoose.startSession();
  const homeObj = {
    homeTitle: payload?.homeTitle,
    user: payload?.user,
  };
  const roomObj = {
    title: payload?.title,
    user: payload?.user,
    color: payload?.color,
  };
  try {
    session.startTransaction();
    const createHome = await Home.create([homeObj], { session });
    if (!createHome[0]) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Home Creation Failed. Please Try Again!"
      );
    }
    roomObj.home = createHome[0]?._id;
    const createRoom = await Room.create([roomObj], { session });
    if (!createRoom[0]) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Room Creation Failed. Please Try Again!"
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return createRoom[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getRoomsByQuery = async (id, query) => {
  const finalQueryObj = {
    user: id,
    ...query,
  };
  if (query.hasOwnProperty("user") && !query.hasOwnProperty("home")) {
    throw new AppError(httpStatus.BAD_REQUEST, "something went wrong!");
  }
  const roomQuery = new QueryBuilder(Room.find(), finalQueryObj)
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await roomQuery.modelQuery;
  const meta = await roomQuery.meta();
  return {
    meta,
    result,
  };
};
const getSingleRoom = async (id) => {
  const result = await Room.findById(id);
  return result;
};
const updateRoom = async (id, payload) => {
  const result = await Room.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteRoom = async (id) => {
  const result = await Room.findByIdAndDelete(id);
  return result;
};

const roomServices = {
  inserRoomIntoDB,
  getRoomsByQuery,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
export default roomServices;
