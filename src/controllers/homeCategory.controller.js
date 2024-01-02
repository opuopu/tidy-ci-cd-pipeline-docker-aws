import httpStatus from "http-status";
import homeCategoryServices from "../services/HomeCategory.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createHomeCategory = catchAsync(async (req, res) => {
  const result = await homeCategoryServices.insertHomeCateogryIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "home category created successfully",
    data: result,
  });
});
const getAllHomeCategories = catchAsync(async (req, res) => {
  const result = await homeCategoryServices.getAllHomeCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Home categories retrieved successfully",
    data: result,
  });
});
const getSingleHomeCategory = catchAsync(async (req, res) => {
  const result = await homeCategoryServices.getAllHomeCategories(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Home category retrieved successfully",
    data: result,
  });
});

const homeCategoryControllers = {
  createHomeCategory,
  getAllHomeCategories,
  getSingleHomeCategory,
};
export default homeCategoryControllers;
