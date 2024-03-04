import { Schema, model } from "mongoose";
const budgetCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "category title is required"],
    },
    icon: {
      type: String,
      required: [true, "category icon is required"],
    },
  },
  {
    timestamps: true,
  }
);
const budgetCategory = model("budgetCategory", budgetCategorySchema);
export default budgetCategory;
