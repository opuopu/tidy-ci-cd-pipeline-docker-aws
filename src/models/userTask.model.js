const userTaskModel = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      required: [true, "task title is required"],
    },
    homeOwner: {
      type: Schema.Types.ObjectId,
      ref: "homeOwner",
      required: [true, "homeowner information is required"],
    },
    employees: [
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
    nextOccurrence: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);
