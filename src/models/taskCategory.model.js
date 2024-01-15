import { Schema, model } from "mongoose";

const taskCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "task category title is required"],
    },
  },
  {
    timestamps: true,
  }
);

const TaskCategory = model("TaskCategory", taskCategorySchema);
export default TaskCategory;
