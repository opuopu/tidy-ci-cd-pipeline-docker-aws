import express from "express";

import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import taskScheduleController from "../controllers/taskSchedule.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.insertUserTaskIntoDB
);
const taskScheduleRoutes = router;
export default taskScheduleRoutes;
