import { Schema, model } from "mongoose";
import { days } from "../constant/workingDays.js";

const AssignWorkScheduleSchema = new Schema(
  {
    homeOwner: {
      type: Schema.Types.ObjectId,
      ref: "homeOwner",
      required: [true, "homeowner information is required"],
    },
    employee: {
      type: String,
      // ref: "Employee",
      required: [true, "employee information is required"],
    },
    assignedDate: {
      type: Date,
      required: [true, "assign date is required"],
      default: new Date(),
    },
    workingDays: [
      {
        type: String,
        enum: days,
      },
    ],
    weekend: [{ type: String, enum: days }],
    reminder: {
      type: Boolean,
      default: true,
    },
    recurrence: {
      type: String,
      enum: ["daily"],
      default: "daily",
    },
  },

  {
    timestamps: true,
  }
);

const AssignSchedule = model("AssignSchedule", AssignWorkScheduleSchema);
export default AssignSchedule;
