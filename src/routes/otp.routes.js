import express from "express";
import otpControllers from "../controllers/otp.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import otpValidation from "../validation/otp.validation.js";
const router = express.Router();
router.post("/resend-otp", otpControllers.createAnOtp);
router.post(
  "/verify-signupOtp",
  validateRequest(otpValidation.SignupOtpVerificationSchema),
  otpControllers.veriFySignupOtp
);
router.post(
  "/verify-forget-password",
  validateRequest(otpValidation.forgotPasswordVerifySchema),
  otpControllers.verifyForgetPasswordOtp
);
router.post("/forgot-passwordOtp", otpControllers.createAnOtp);

const otpRoutes = router;
export default otpRoutes;
