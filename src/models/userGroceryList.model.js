import { Schema, Types, model } from "mongoose";
const userGrocerySchema = new Schema(
  {
    homeOwner: {
      type: Types.ObjectId,
      ref: "User",
    },
    employee: {
      type: String,
      ref: "Employee",
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
