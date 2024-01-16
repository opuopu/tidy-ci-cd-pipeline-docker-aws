import express from "express";
import userTaskControllers from "../controllers/userTask.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  userTaskControllers.insertUserTaskIntoDB
);
const userTasksRoutes = router;
export default userTasksRoutes;
