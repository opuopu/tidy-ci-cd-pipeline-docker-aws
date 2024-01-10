import { Schema, Types, model } from "mongoose";
const userGrocerySchema = new Schema(
  {
    homeOwner: {
      type: Types.ObjectId,
      ref: "User",
    },
    assignedEmployee: {
      type: String,
      ref: "Employee",
    },
    groceryLists: [
      {
        type: Types.ObjectId,
        ref: "GroceryList",
      },
    ],
    date: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserGroceryList = model("UserGroceryList", userGrocerySchema);
export default UserGroceryList;
