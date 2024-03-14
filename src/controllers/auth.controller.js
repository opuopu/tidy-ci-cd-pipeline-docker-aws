import httpStatus from "http-status";
import authServices from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { createFileDetails } from "../utils/file.utils.js";

const signupHomeOwnerIntoDB = catchAsync(async (req, res, next) => {
  req.body.role = "homeowner";
  req.body.image = "/uploads/profile/image.png";
  const result = await authServices.signupHomeOwnerIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "please verify your otp now",
    data: result ?? null,
  });
});
const signupEmployeeIntoDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;

  if (req?.file) {
    req.body.image = createFileDetails("employee", req?.file?.filename);
  }

  const result = await authServices.signupEmployeeIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee added successfully",
    data: result,
  });
});
const SigninHomeOwner = catchAsync(async (req, res) => {
  const result = await authServices.SigninHomeOwner(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user Sign In successfully",
    data: result,
  });
});
const SigninEmployee = catchAsync(async (req, res) => {
  const result = await authServices.SigninEmployee(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user Sign In successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const result = await authServices.refreshToken(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Updated succesfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await authServices.resetPassword(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Updated succesfully",
    data: result,
  });
});
const authControllers = {
  signupHomeOwnerIntoDB,
  signupEmployeeIntoDb,
  SigninHomeOwner,
  refreshToken,
  forgotPassword,
  resetPassword,
  SigninEmployee,
};
export default authControllers;
