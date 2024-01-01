import httpStatus from "http-status";
import otpServices from "../services/otp.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
const createAnOtp = catchAsync(async (req, res, next) => {
  const result = await otpServices.createAnOtpIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP created successfully",
    data: result,
  });
});
const verifyOtp = catchAsync(async (req, res, next) => {
  const result = await otpServices.verifyOtp(req.params.email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: result ? result : null,
  });
});

const otpControllers = {
  createAnOtp,
  verifyOtp,
};
export default otpControllers;
