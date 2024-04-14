import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Room from "../models/room.model.js";
import mongoose from "mongoose";
import Home from "../models/home.model.js";
import HomeOwner from "../models/homeOwner.model.js";
const inserRoomIntoDB = async (payload) => {
  const session = await mongoose.startSession();
  const homeObj = {
    title: payload?.homeTitle,
    user: payload?.user,
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
    const updateHomeOwner = await HomeOwner.findOneAndUpdate(
      {
        id: payload?.id,
      },
      {
        $addToSet: {
          homes: createHome[0]?._id,
        },
      },
      { new: true, session }
    );
    if (!updateHomeOwner) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "failed to add home. plase try again"
      );
    }
    const rooms = payload.rooms.map((room) => ({
      home: createHome[0]._id,
      ...room,
    }));

    const createRoom = await Room.create(rooms, { session });
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
const insertSingleRoomIntoDb = async (payload) => {
  const result = await Room.create(payload);
  return result;
};
const getRoomsByQuery = async (query) => {
  const roomQuery = new QueryBuilder(Room.find(), query)
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
  const result = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

const roomServices = {
  inserRoomIntoDB,
  insertSingleRoomIntoDb,
  getRoomsByQuery,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
export default roomServices;
