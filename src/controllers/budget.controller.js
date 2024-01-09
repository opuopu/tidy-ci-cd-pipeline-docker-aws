import httpStatus from "http-status";
import budgetCategoryServices from "../services/budgetCategory.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertBudgetIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.user = userId;
  const result = await budgetCategoryServices.insertBudgetCategoryIntoDb(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget created successfully",
    data: result,
  });
});
const getbudgetsByQuery = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await budgetCategoryServices.getbudgetsByQuery(
    userId,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "budget created successfully",
    data: result,
  });
});
