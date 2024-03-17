import express from "express";

import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import taskScheduleController from "../controllers/workSchedule.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.insertUserTaskIntoDB
);
router.post(
  "/break-time",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.insertBreakTimeIntoDb
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.getallWorkSchedules
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.getSingleWorkSchedule
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.updateSchedule
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.deleteSingleSchedule
);

const workScheduleRoutes = router;
export default workScheduleRoutes;
