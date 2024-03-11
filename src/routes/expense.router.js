import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import expenseController from "../controllers/expense.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  expenseController.insertExpenseIntoDb
);

router.get(
  "/:budgetId",
  auth(USER_ROLE.HOMEOWNER),
  expenseController.getBudgetWiseExpenses
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  expenseController.deleteExpense
);

const expenseRouter = router;
export default expenseRouter;
