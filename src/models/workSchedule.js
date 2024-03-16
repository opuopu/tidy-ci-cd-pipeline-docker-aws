import { Schema, model } from "mongoose";
import { days } from "../constant/workingDays.js";
export const AssignWorkScheduleSchema = new Schema({});

const WorkScheduleSchema = new Schema(
  {
    task: {
      type: String,
      required: [true, "task is required"],
    },
    homeOwner: {
      type: Schema.Types.ObjectId,
      ref: "homeOwner",
      required: [true, "homeowner information is required"],
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "employee information is required"],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      // required: [true, "room is required"],
    },
    assignedDate: {
      type: String,
      required: [true, "task date is required"],
    },
    startTime: {
      type: String, // Start time as a string
      required: [true, "Start Time Is Required"],
    },
    endTime: {
      type: String, // End time as a string
      required: [true, "End Time Is Required"],
    },
    breakTime: {
      type: String, // break time as a string
    },
    workingDays: [
      {
        type: String,
        enum: days,
      },
    ],
    weekend: [{ type: String, enum: days }],
    recurrence: {
      type: String,
      enum: ["daily", "weekly", "monthly", "onetime"],
      default: "daily",
    },
    reminder: {
      type: Boolean,
      default: true,
    },
    recurrence: {
      type: String,
      enum: ["daily"],
      default: "daily",
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "busy"],
      default: "ongoing",
    },
    reason: {
      type: String,
      enum: ["sick", "busy", "personal_reason", "other"],
    },

    note: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const WorkSchedule = model("WorkSchedule", WorkScheduleSchema);
export default WorkSchedule;
