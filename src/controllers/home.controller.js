import httpStatus from "http-status";
import homeServices from "../services/home.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createHome = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const result = await homeServices.inserHomeIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Home created successfully",
    data: result,
  });
});
const getAllHomes = catchAsync(async (req, res, next) => {
  const result = await homeServices.getAllHomes(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "homes are retrieved successfully.",
    data: result,
  });
});

const getSingleHome = catchAsync(async (req, res, next) => {
  const result = await homeServices.getSingleHome(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "home retrieved successfully",
    data: result,
  });
});
const updateHome = catchAsync(async (req, res, next) => {
  const result = await homeServices.updateHome(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "home is updated successfully",
    data: result,
  });
});
const deleteHome = catchAsync(async (req, res, next) => {
  const result = await homeServices.deleteHome(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "home is deleted successfully",
    data: result,
  });
});

const homeControllers = {
  createHome,
  getAllHomes,
  getSingleHome,
  updateHome,
  deleteHome,
};
export default homeControllers;
