import { Schema, model } from "mongoose";
import {
  addDays,
  addWeeks,
  addMonths,
  isAfter,
  parseISO,
  set,
  parse,
} from "date-fns";
const TaskScheduleSchema = new Schema(
  {
    task: {
      type: String,
    },
    groceries: [
      {
        type: Schema.Types.ObjectId,
        ref: "GroceryList",
      },
    ],
    homeOwner: {
      type: Schema.Types.ObjectId,
      ref: "homeOwner",
      required: [true, "homeowner information is required"],
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "room is required"],
    },

    date: {
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
    recurrence: {
      type: String,
      enum: ["daily", "weekly", "monthly", "onetime"],
      default: "onetime",
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "onGoing", "completed", "busy"],
      default: "pending",
    },
    reason: {
      type: String,
      enum: ["sick", "busy", "personal_reason", "other"],
    },
    note: {
      type: String,
    },
    nextOccurrence: {
      type: Date,
      required: [true, "next nextOccurrence date and time is required"],
    },
  },

  {
    timestamps: true,
  }
);

// userTasksSchema.pre("save", async function (next) {
//   console.log(this);
//   const userChoosenDate = parseISO(this.date);
//   const userChosenTime = parse(this?.time, "hh:mm a", new Date());
//   console.log("User Chosen Time:", userChosenTime);
//   const combineDateandTime = set(userChoosenDate, {
//     hours: userChosenTime.getHours(),
//     minutes: userChosenTime.getMinutes(),
//     seconds: userChosenTime.getSeconds(),
//   });
//   console.log(combineDateandTime);
//   switch (this?.repeat) {
//     case "daily":
//       this.nextOccurrence = addDays(combineDateandTime, 1);
//       break;
//     case "weekly":
//       this.nextOccurrence = addWeeks(combineDateandTime, 1);
//       break;
//     case "monthly":
//       this.nextOccurrence = addMonths(combineDateandTime, 1);
//       break;
//     default:
//       this.nextOccurrence = null;
//   }
//   next();
// });

const TaskSchedule = model("TaskSchedule", TaskScheduleSchema);
export default TaskSchedule;
