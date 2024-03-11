import httpStatus from "http-status";
import expenseServices from "../services/expense.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertExpenseIntoDb = catchAsync(async (req, res) => {
  const result = await expenseServices.InsertExpenseIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense added successfully",
    data: result,
  });
});
const getBudgetWiseExpenses = catchAsync(async (req, res) => {
  const result = await expenseServices.getBudgetWiseExpenses(
    req.params.budgetId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expenses Retrived Successfully",
    data: result,
  });
});
const deleteExpense = catchAsync(async (req, res) => {
  const result = await expenseServices.deleteExpense(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense added successfully",
    data: result,
  });
});

const expenseController = {
  insertExpenseIntoDb,
  getBudgetWiseExpenses,
  deleteExpense,
};

export default expenseController;
