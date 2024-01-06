import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Room from "../models/room.model.js";

const inserRoomIntoDB = async (payload) => {
  const result = await Room.create(payload);
  return result;
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
