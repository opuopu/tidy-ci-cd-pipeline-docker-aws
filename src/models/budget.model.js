import { Schema, model } from "mongoose";

const budgetSchema = new Schema({
  name: {
    type: String,
    required: [true, "budget name is required"],
  },
  category: {},
});
