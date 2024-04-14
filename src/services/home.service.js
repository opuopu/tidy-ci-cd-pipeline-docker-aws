import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Home from "../models/home.model.js";
import mongoose from "mongoose";
import Room from "../models/room.model.js";
import HomeOwner from "../models/homeOwner.model.js";
const inserHomeIntoDB = async (payload) => {
  const result = await Home.create(payload);
  return result;
};
const getAllHomes = async (query) => {
  const homequery = new QueryBuilder(Home.find().populate("user"), query)
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await homequery.modelQuery;
  const meta = await homequery.meta();
  return {
    meta,
    result,
  };
};

const getSingleHome = async (id) => {
  const result = await Home.findOne({ _id: id });
  return result;
};
const updateHome = async (id, payload) => {
  const result = await Home.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const deleteHome = async (homeOwnerId, id) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteHome = await Home.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );
    if (!deleteHome) {
      throw (
        (new AppError(httpStatus.METHOD_NOT_ALLOWED, "Failed To Delete Home"),
        { session })
      );
    }
    const updateHomeOwner = await HomeOwner.findOneAndUpdate(
      {
        id: homeOwnerId,
      },
      {
        $pull: {
          homes: deleteHome[0]?._id,
        },
      },
      { new: true, session }
    );
    if (!updateHomeOwner) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed To Delete Home.Please try again"
      );
    }
    // const deleteRoom = await Room.updateMany({ home: id }, { session });
    // if (!deleteRoom.acknowledged) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     "Failed To Delete Home.Please try again"
    //   );
    // }
    await session.commitTransaction();
    await session.endSession();
    return deleteHome;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const homeServices = {
  inserHomeIntoDB,
  getAllHomes,
  getSingleHome,
  updateHome,
  deleteHome,
};

export default homeServices;
