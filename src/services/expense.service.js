import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import Budget from "../models/budget.model.js";
const InsertExpenseIntoDb = async (payload) => {
  const session = await mongoose.startSession();
  const findBudget = await Budget.findById(payload.budget);
  if (findBudget?.progress === 100) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Budget progress full. Please update amount."
    );
  }
  if (payload?.amount > findBudget.remainingAmount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Insufficient remaining budget. Please adjust the budget amount."
    );
  }
  try {
    session.startTransaction();
    const result = await Expense.create([payload], { session });
    if (!result[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create expense");
    }

    const updateBudget = await Budget.findByIdAndUpdate(
      payload.budget,
      {
        $inc: {
          progress: (payload?.amount / findBudget?.amount) * 100,
          remainingAmount: -payload?.amount,
        },
      },
      { new: true, session }
    );
    if (!updateBudget) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to update budget");
    }
    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getBudgetWiseExpenses = async (query) => {
  const result = await Expense.find(query).populate("budget");
  return result;
};

const deleteExpense = async (id) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteExpense = await Expense.findByIdAndDelete(id, { session });
    if (!deleteExpense) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete expense");
    }
    const findBudget = await Budget.findById(deleteExpense?.budget);
    const updatedBudget = await Budget.findByIdAndUpdate(
      deleteExpense?.budget,
      {
        $inc: {
          progress: -(deleteExpense?.amount / findBudget.amount) * 100,
          remainingAmount: deleteExpense?.amount,
        },
      },
      { new: true, session }
    );
    if (!updatedBudget) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to update expense");
    }
    session.commitTransaction();
    session.endSession();
    return deleteExpense[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const expenseServices = {
  InsertExpenseIntoDb,
  getBudgetWiseExpenses,
  deleteExpense,
};
export default expenseServices;
