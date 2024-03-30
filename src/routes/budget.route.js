import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import budgetControllers from "../controllers/budget.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import budgetValidationSchema from "../validation/budget.validation.js";
const router = express.Router();
router.post(
  "/",
  validateRequest(budgetValidationSchema.postBudgetSchema),
  auth(USER_ROLE.HOMEOWNER),
  budgetControllers.insertBudgetIntoDB
);
router.get(
  "/budget-vs-expense",
  auth(USER_ROLE.HOMEOWNER),
  budgetControllers.budgetVsExpense
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  budgetControllers.getbudgetsByQuery
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  budgetControllers.getsingleBudget
);
router.patch("/:id", auth(USER_ROLE.HOMEOWNER), budgetControllers.updateBudget);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  budgetControllers.deleteBudget
);
const budgetRoutes = router;
export default budgetRoutes;
