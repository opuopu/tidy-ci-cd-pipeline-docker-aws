import httpStatus from "http-status";
import authServices from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const signupHomeOwnerIntoDB = catchAsync(async (req, res, next) => {
  const result = await authServices.signupHomeOwnerIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user Sign up successfully",
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
  const result = await authServices.forgotPassword(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "otp send successfully. please check your email",
    data: result ? result : null,
  });
});
const updatePassword = catchAsync(async (req, res) => {
  const result = await authServices.updatePassword(req.params.email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password update successfully!",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const result = await authServices.resetPassword(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password reset successfully!",
    data: result,
  });
});
const authControllers = {
  signupHomeOwnerIntoDB,
  signIn,
  refreshToken,
  forgotPassword,
  updatePassword,
  resetPassword,
};
export default authControllers;
