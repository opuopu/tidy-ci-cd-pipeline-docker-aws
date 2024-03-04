import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Home from "../models/home.model.js";
import mongoose from "mongoose";
import Room from "../models/room.model.js";
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
  const result = await Home.findOne({ _id: id }).populate("user");
  return result;
};
const updateHome = async (id, payload) => {
  const result = await Home.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("user");
  return result;
};
const deleteHome = async (id) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteHome = await Home.findByIdAndDelete(id);
    if (!deleteHome) {
      throw (
        (new AppError(httpStatus.METHOD_NOT_ALLOWED, "Failed To Delete Home"),
        { session })
      );
    }
    await Room.deleteMany({ home: id }, { session });

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
