import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import taskCategoryControllers from "../controllers/taskCategory.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskCategoryControllers.insertTaskCategoryIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskCategoryControllers.getAllTaskCategoires
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  taskCategoryControllers.getsingleTaskCategory
);
const taskCategoryRoutes = router;
export default taskCategoryRoutes;
