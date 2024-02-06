import express from "express";

import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import taskScheduleController from "../controllers/taskSchedule.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.insertUserTaskIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.getAllTaskSchedule
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.getAllTaskSchedule
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.updateTaskSchedule
);
router.patch(
  "/add-groceries/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.addGroceriesIntoTask
);
router.patch(
  "/remove-groceries/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.removeGroceriesFromTask
);
router.patch(
  "/update-status/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskScheduleController.changeTaskStatus
);
router.patch(
  "/re-assign/:id",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.reAssignTask
);
router.post(
  "/schedule",
  auth(USER_ROLE.HOMEOWNER),
  taskScheduleController.scheduleTask
);

const taskScheduleRoutes = router;
export default taskScheduleRoutes;
