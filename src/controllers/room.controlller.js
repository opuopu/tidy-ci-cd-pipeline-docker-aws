import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import roomServices from "../services/room.service.js";

const inserRoomIntoDB = catchAsync(async (req, res) => {
  const result = await roomServices.inserRoomIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "room is   created successfully",
    data: result,
  });
});
const getRoomsByQuery = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const result = await roomServices.getRoomsByQuery(userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rooms retrieved successfully.",
    data: result,
  });
});
const getSingleRoom = catchAsync(async (req, res) => {
  const result = await roomServices.getSingleRoom(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room is retrieved successfully.",
    data: result,
  });
});
const updateRoom = catchAsync(async (req, res) => {
  const result = await roomServices.updateRoom(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room is updated successfully.",
    data: result,
  });
});
const deleteRoom = catchAsync(async (req, res) => {
  const result = await roomServices.deleteRoom(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room is deleted successfully.",
    data: result,
  });
});

const roomControllers = {
  inserRoomIntoDB,
  getRoomsByQuery,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};

export default roomControllers;
