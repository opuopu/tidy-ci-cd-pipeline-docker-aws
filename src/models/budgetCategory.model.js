import { Schema, model } from "mongoose";
const budgetCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "category title is required"],
    },
    icon: {
      publicUrl: {
        type: String,
      },
      path: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
const budgetCategory = model("budgetCategory", budgetCategorySchema);
export default budgetCategory;
