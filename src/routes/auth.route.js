import express from "express";
import authControllers from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import validateRequest from "../middlewares/validateRequest.js";
import authValidation from "../validation/auth.validation.js";
const router = express.Router();

router.post("/signup", authControllers.signupHomeOwnerIntoDB);
router.post(
  "/signin",
  validateRequest(authValidation.singinSchema),
  authControllers.signIn
);
router.post("/refreshToken", authControllers.refreshToken);
router.post("/forgot-password", authControllers.forgotPassword);
router.patch(
  "/resetPassword",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  authControllers.resetPassword
);
const authRoutes = router;
export default authRoutes;
