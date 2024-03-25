import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import historyControllers from "../controllers/taskCompletationHistory.controller.js";

const router = express.Router();
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  historyControllers.getAllHistoryByTaskId
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  historyControllers.deleteAllHistory
);
const taskcompletationHistoryRoutes = router;
export default taskcompletationHistoryRoutes;
