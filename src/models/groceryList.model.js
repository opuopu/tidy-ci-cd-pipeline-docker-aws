import { Schema, model, Types } from "mongoose";
const groceryListSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "grocery list name is required"],
    },
    category: {
      type: Types.ObjectId,
      ref: "GroceryCategory",
    },
  },
  {
    timestamps: true,
  }
);

const GroceryList = model("GroceryList", groceryListSchema);
export default GroceryList;
