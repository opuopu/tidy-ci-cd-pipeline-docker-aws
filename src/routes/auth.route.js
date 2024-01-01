import express from "express";
import authControllers from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
const router = express.Router();

router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.signIn);
router.post("/refreshToken", authControllers.refreshToken);
router.post("/forgotPassword", authControllers.forgotPassword);
router.patch("/updatePassword/:email", authControllers.updatePassword);
router.patch(
  "/resetPassword/:id",
  auth(USER_ROLE.HomeOwner, USER_ROLE.EMPLOYEE),
  authControllers.resetPassword
);
const authRoutes = router;
export default authRoutes;
