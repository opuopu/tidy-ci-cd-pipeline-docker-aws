import { Schema, model } from "mongoose";
const {
  addDays,
  addWeeks,
  addMonths,
  isAfter,
  parseISO,
  set,
  parse,
} = require("date-fns");
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
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "room is required"],
      },
    ],
    date: {
      type: Date,
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
  },

  {
    timestamps: true,
  }
);

userTasksSchema.statics.calculateNextOccurence = async function () {
  const task = await userTasks.findOne({});
  const userChoosenDate = parseISO(task?.date);
  const userChosenTime = parse(task?.time, "h:mm a", new Date());
  const combineDateandTime = set(userChoosenDate, {
    hours: userChosenTime.getHours(),
    minutes: userChosenTime.getMinutes(),
    seconds: userChoosenDate.getSeconds(),
  });
  switch (task?.repeat) {
    case "daily":
      return addDays(combineDateandTime, 1);
    case "weekly":
      return addWeeks(combineDateandTime, 1);
    case "monthly":
      return addMonths(combineDateandTime, 1);

    default:
      return null;
  }
};

const userTasks = model("userTask", userTasksSchema);
export default userTasks;
