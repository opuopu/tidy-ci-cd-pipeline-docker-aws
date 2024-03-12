import { Schema, Types, model } from "mongoose";
const userGrocerySchema = new Schema(
  {
    title: {
      type: String,
      default: "Buy Grocries",
    },
    homeOwner: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "homwowner information is required"],
    },
    employee: {
      type: String,
      ref: "Employee",
      required: [true, "employee information is required"],
    },
    groceryLists: [
      {
        type: String,
      },
    ],
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "busy", "completed"],
      default: "pending",
    },
    instruction: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserGroceryList = model("UserGroceryList", userGrocerySchema);
export default UserGroceryList;
