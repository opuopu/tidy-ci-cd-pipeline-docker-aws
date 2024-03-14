import httpStatus from "http-status";
import packageServices from "../services/Package.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
const createPackageIntoDB = catchAsync(async (req, res) => {
  const result = await packageServices.createPackageIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "package created successfully",
    data: result,
  });
});
const getAllPackages = catchAsync(async (req, res) => {
  const result = await packageServices.getAllPackages();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "packages retrived successfully",
    data: result,
  });
});
const getSinglePackage = catchAsync(async (req, res) => {
  const result = await packageServices.getSinglePackage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "package retrived successfully",
    data: result,
  });
});
const packageControllers = {
  createPackageIntoDB,
  getAllPackages,
  getSinglePackage,
};
export default packageControllers;
