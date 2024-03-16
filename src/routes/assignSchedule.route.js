import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import AssignScheduleControllers from "../controllers/assignScheudle.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  AssignScheduleControllers.insertScheduleIntoDb
);
const assignSchedulesRoutes = router;
export default assignSchedulesRoutes;
