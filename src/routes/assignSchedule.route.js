import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import AssignScheduleControllers from "../controllers/assignScheudle.controller.js";

const router = express.Router();
router.get(
  "/sunday-thursday",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getDataFromSundayToThursday
);
router.get(
  "/weekend",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getWeekendData
);
router.get(
  "/saturday",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getSaturdayData
);
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  AssignScheduleControllers.insertScheduleIntoDb
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getAllSchedules
);
router.get(
  "/details/:scheduleId",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.employeeWorkDetailsByScheduleId
);
router.get(
  "/employee",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getScheduleDataByEmployee
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  AssignScheduleControllers.getAssignedScheduleById
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  AssignScheduleControllers.updateAssignSchedule
);

const assignSchedulesRoutes = router;
export default assignSchedulesRoutes;
