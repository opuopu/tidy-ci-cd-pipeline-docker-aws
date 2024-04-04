import QueryBuilder from "../builder/QueryBuilder.js";
import Budget from "../models/budget.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
const insertBudgetIntoDB = async (payload) => {
  console.log(payload);
  const { month } = payload;
  const [year, mon] = month.split("-");
  const formatedDate = `${year}-${mon}-01T00:00:00.000Z`;
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

  payload.month = new Date(formatedDate);
  console.log(payload);
  const result = await Budget.create(payload);
  return result;
};
const getbudgetsByQuery = async (query) => {
  const budgetModel = new QueryBuilder(
    Budget.find().populate("category"),
    query
  )
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
  const result = await Budget.findById(id).populate("category");
  return result;
};

const updateBudget = async (id, userId, payload) => {
  const result = await Budget.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteBudget = async (id) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Budget.findByIdAndDelete(id, { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete budget");
    }
    const deleteExpenses = await Expense.deleteMany(
      { budget: id },
      { session }
    );
    if (!deleteExpenses.acknowledged) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete expenses");
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const budgetVsexpense = async (query) => {
  const { month, user } = query;
  console.log(user);
  const userObjectId = new mongoose.Types.ObjectId(user);
  const [year, monthValue] = month?.split("-").map(Number);
  const startDate = new Date(Date.UTC(year, monthValue - 1, 1));
  const endDate = new Date(Date.UTC(year, monthValue, 0));
  const result = await Budget.aggregate([
    {
      $match: {
        user: userObjectId,
        month: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $lookup: {
        from: "budgetcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category", // Unwind the category array
    },
    {
      $project: {
        category: "$category.title", // Assuming name is the field you want to project from the Categories collection
        budgetAmount: "$amount",
        totalExpenseAmount: { $subtract: ["$amount", "$remainingAmount"] },
      },
    },
  ]);

  return result;
};
const budgetServices = {
  insertBudgetIntoDB,
  getbudgetsByQuery,
  getSingleBudget,
  updateBudget,
  deleteBudget,
  budgetVsexpense,
};
export default budgetServices;
