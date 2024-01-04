import { Schema, model } from "mongoose";
const GroceryCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "grocery title is required"],
    },
  },
  {
    timestamps: true,
  }
);
const GroceryCategory = model("GroceryCategory", GroceryCategorySchema);
export default GroceryCategory;
