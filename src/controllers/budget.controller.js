import httpStatus from "http-status";
import budgetCategoryServices from "../services/budgetCategory.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import budgetServices from "../services/budget.service.js";

const insertBudgetIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.remainingAmount = req.body.amount;
  req.body.user = userId;
  const result = await budgetServices.insertBudgetIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget created successfully",
    data: result,
  });
});
const getbudgetsByQuery = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.user = userId;
  const result = await budgetServices.getbudgetsByQuery(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budgets retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getsingleBudget = catchAsync(async (req, res) => {
  const result = await budgetServices.getSingleBudget(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget retrived successfully",
    data: result,
  });
});

const updateBudget = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await budgetServices.updateBudget(
    req.params.id,
    userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget updated successfully",
    data: result,
  });
});
const deleteBudget = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await budgetServices.deleteBudget(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget updated successfully",
    data: result,
  });
});

const budgetControllers = {
  insertBudgetIntoDB,
  getbudgetsByQuery,
  getsingleBudget,
  updateBudget,
  deleteBudget,
};
export default budgetControllers;
