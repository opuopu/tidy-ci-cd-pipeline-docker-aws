import { Schema, model } from "mongoose";
const budgetCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "category title is required"],
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const budgetCategory = model("budgetCategory", budgetCategorySchema);
export default budgetCategory;
