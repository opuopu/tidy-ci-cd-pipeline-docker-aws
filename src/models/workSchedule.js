import { Schema, model } from "mongoose";
import { days } from "../constant/workingDays.js";
export const AssignWorkScheduleSchema = new Schema({});

const WorkScheduleSchema = new Schema(
  {
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "AssignSchedule",
      required: [true, "assign schedule id is required"],
    },
    task: {
      type: String,
      required: [true, "task is required"],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      // required: [true, "room is required"],
    },
    startTime: {
      type: String, // Start time as a string
      required: [true, "Start Time Is Required"],
    },
    endTime: {
      type: String, // End time as a string
      required: [true, "End Time Is Required"],
    },
    type: {
      type: String,
      enum: ["work", "break"],
      default: "work",
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
