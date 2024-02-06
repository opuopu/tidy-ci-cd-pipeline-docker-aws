import { Schema, model } from "mongoose";
const taskListSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "TaskCategory",
    },
    title: {
      type: String,
      required: [true, "task title is required"],
    },
    // Repeat: {
    //   type: String,
    //   enum: ["Weekly", "Monthly, weekly", "Daily"],
    // },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const TaskList = model("TaskList", taskListSchema);
export default TaskList;
