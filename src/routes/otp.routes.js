import express from "express";
import otpControllers from "../controllers/otp.controller.js";
const router = express.Router();
router.post("/resend-otp", otpControllers.createAnOtp);
router.post("/verify-signupOtp", otpControllers.veriFySignupOtp);

const otpRoutes = router;
export default otpRoutes;
