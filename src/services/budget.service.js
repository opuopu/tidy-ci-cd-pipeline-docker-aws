import dayjs from "dayjs";
import QueryBuilder from "../builder/QueryBuilder.js";
import Budget from "../models/budget.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
const insertBudgetIntoDB = async (payload) => {
  const { month } = payload;
  const isExistBudget = await Budget.findOne({
    user: payload?.user,
    category: payload?.category,
  });
  if (isExistBudget) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Budget Already Exist With This Category"
    );
  }
  const formattedDate = dayjs(month).format("01-MM-YYYY");
  payload.month = formattedDate;
  const result = await Budget.create(payload);
  return result;
};
const getbudgetsByQuery = async (query) => {
  const budgetModel = new QueryBuilder(Budget.find(), query)
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await budgetModel.modelQuery;
  const meta = await budgetModel.meta();
  return {
    meta,
    result,
  };
};
const getSingleBudget = async (id) => {
  const result = await Budget.findById(id);
  return result;
};

const updateBudget = async (id, userId, payload) => {
  const result = await Budget.findOneAndUpdate(
    { _id: id, user: userId },
    payload,
    {
      new: true,
    }
  );
  return result;
};

const deleteBudget = async (id, userId) => {
  const result = await Budget.findOneAndDelete({ _id: id, user: userId });
  return result;
};

const budgetServices = {
  insertBudgetIntoDB,
  getbudgetsByQuery,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
export default budgetServices;
