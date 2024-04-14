import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import employeeControllers from "../controllers/employee.controller.js";
const router = express.Router();
router.get(
  "/additional-task",
  auth(USER_ROLE.EMPLOYEE),
  employeeControllers.AdditionalTask
);
router.get("/", auth(USER_ROLE.HOMEOWNER), employeeControllers.getAllEmployees);
router.get(
  "/groceries",
  auth(USER_ROLE.EMPLOYEE),
  employeeControllers.GetTotalGroceries
);

router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  employeeControllers.getSingleEmployee
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  employeeControllers.updateAnEmployee
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  employeeControllers.deleteAnEmployee
);
router.post(
  "/send-email",
  auth(USER_ROLE.HOMEOWNER),
  employeeControllers.sendEmailAndPassword
);

const employeeRoutes = router;
export default employeeRoutes;
