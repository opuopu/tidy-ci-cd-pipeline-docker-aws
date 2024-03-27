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
      type: Types.ObjectId,
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
      enum: ["pending", "busy", "completed", "awaiting_approval"],
      default: "pending",
    },
    buyRequest: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "",
    },
    instruction: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserGroceryList = model("UserGroceryList", userGrocerySchema);
export default UserGroceryList;
