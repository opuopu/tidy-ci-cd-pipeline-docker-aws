import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import userControllers from "../controllers/user.controller.js";
const router = express.Router();

router.get(
  "/my-profile",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userControllers.getme
);
router.patch(
  "/update-profile",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userControllers.updateMyProfile
);

const userRoutes = router;

export default userRoutes;
