import express from "express";
import authControllers from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import validateRequest from "../middlewares/validateRequest.js";
import authValidation from "../validation/auth.validation.js";
import parseData from "../middlewares/parseData.js";
import fileUpload from "../middlewares/fileUpload.js";
const router = express.Router();
const upload = fileUpload("./public/uploads/employee/");
router.post("/homeOwner/signup", authControllers.signupHomeOwnerIntoDB);
router.post(
  "/employee/signup",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.HOMEOWNER),
  authControllers.signupEmployeeIntoDb
);
router.post(
  "/homeOwner/signIn",
  // validateRequest(authValidation.singinSchema),
  authControllers.SigninHomeOwner
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
