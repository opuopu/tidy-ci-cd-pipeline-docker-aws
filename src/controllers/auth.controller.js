import httpStatus from "http-status";
import authServices from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
const signUp = catchAsync(async (req, res, next) => {
  const result = await authServices.signUpIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created successfully",
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
const authControllers = {
  signUp,
  signIn,
};
export default authControllers;
