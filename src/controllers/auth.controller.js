import httpStatus from "http-status";
import authServices from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const signupHomeOwnerIntoDB = catchAsync(async (req, res, next) => {
  const result = await authServices.signupHomeOwnerIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "please verify your otp now",
    data: result,
  });
});
const signIn = catchAsync(async (req, res) => {
  const result = await authServices.SignInUser(req.body);
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
  signIn,
  refreshToken,
  forgotPassword,
  resetPassword,
};
export default authControllers;
