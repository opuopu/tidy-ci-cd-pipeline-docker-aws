import { Schema, model, Types } from "mongoose";
const budgetSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "budget name is required"],
    },
    period: {
      type: String,
      enum: ["Week", "Month", "Year", "One Time"],
      trim: true,
      required: [true, "budget period is required"],
    },
    category: {
      type: Types.ObjectId,
      ref: "budgetCategory",
      required: [true, "budget category is required"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    amountType: {
      type: String,
      required: [true, "amount type is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount  is required"],
    },
    month: {
      type: Date,
      // required: [true, "month is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Budget = model("Budget", budgetSchema);
export default Budget;
