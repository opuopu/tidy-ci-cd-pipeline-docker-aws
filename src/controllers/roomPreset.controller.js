import httpStatus from "http-status";
import roomPresetServices from "../services/roomPreset.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createRoomPresetIntoDB = catchAsync(async (req, res) => {
  const result = await roomPresetServices.createRoomPresetIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Preset created successfully",
    data: result,
  });
});
const getAllRoomPresets = catchAsync(async (req, res) => {
  const result = await roomPresetServices.getAllRoomPresets();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Presets retrived successfully",
    data: result,
  });
});
const getsingRoompreset = catchAsync(async (req, res) => {
  const result = await roomPresetServices.getsingRoompreset(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Preset retrived successfully",
    data: result,
  });
});
const deleteRoomPreset = catchAsync(async (req, res) => {
  const result = await roomPresetServices.deleteRoomPreset(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Preset deleted successfully",
    data: result,
  });
});

const roompresetsControllers = {
  createRoomPresetIntoDB,
  getAllRoomPresets,
  getsingRoompreset,
  deleteRoomPreset,
};
export default roompresetsControllers;
