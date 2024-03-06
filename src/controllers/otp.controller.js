import httpStatus from "http-status";
import otpServices from "../services/otp.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
const createAnOtp = catchAsync(async (req, res) => {
  const result = await otpServices.createAnOtpIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Please Check Your Email",
    data: result ?? null,
  });
});
const veriFySignupOtp = catchAsync(async (req, res) => {
  const result = await otpServices.veriFySignupOtp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: result ? result : null,
  });
});

const otpControllers = {
  createAnOtp,
  veriFySignupOtp,
};
export default otpControllers;
