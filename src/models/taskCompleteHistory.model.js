import { Schema, model } from "mongoose";

const taskCompletationHistorySchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "AdditionalTask",
    },
    date: {
      type: Date,
      required: [true, "task date is required"],
    },
    type: {
      type: String,
      enum: ["daily", "additional", "grocery"],
    },
  },

  {
    timestamps: true,
  }
);

const TaskCompletationHistory = model(
  "TaskCompletationHistory",
  taskCompletationHistorySchema
);
export default TaskCompletationHistory;
