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
const userTasksSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "task title is required"],
    },
    homeOwner: {
      type: Schema.Types.ObjectId,
      ref: "homeOwner",
      required: [true, "homeowner information is required"],
    },
    assigned: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "room is required"],
    },

    date: {
      type: String,
      required: [true, "task date is required"],
    },
    time: {
      type: String, // Store time as a string
      required: [true, "task time is required"],
    },
    repeat: {
      type: String,
      default: "never",
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    nextOccurrence: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

userTasksSchema.pre("save", async function (next) {
  console.log(this);
  const userChoosenDate = parseISO(this.date);
  const userChosenTime = parse(this?.time, "hh:mm a", new Date());
  console.log("User Chosen Time:", userChosenTime);
  const combineDateandTime = set(userChoosenDate, {
    hours: userChosenTime.getHours(),
    minutes: userChosenTime.getMinutes(),
    seconds: userChosenTime.getSeconds(),
  });
  console.log(combineDateandTime);
  switch (this?.repeat) {
    case "daily":
      this.nextOccurrence = addDays(combineDateandTime, 1);
      break;
    case "weekly":
      this.nextOccurrence = addWeeks(combineDateandTime, 1);
      break;
    case "monthly":
      this.nextOccurrence = addMonths(combineDateandTime, 1);
      break;
    default:
      this.nextOccurrence = null;
  }
  next();
});

const userTasks = model("userTask", userTasksSchema);
export default userTasks;
