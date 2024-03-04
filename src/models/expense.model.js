import { Schema, model, Types } from "mongoose";
const expenseSchema = new Schema(
  {
    budget: {
      type: Types.ObjectId,
      ref: "budgetCategory",
      required: [true, "budget category is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount  is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Expense = model("Expense", expenseSchema);
export default Expense;
