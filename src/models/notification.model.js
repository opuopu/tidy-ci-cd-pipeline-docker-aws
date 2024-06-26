import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refference: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema);
export default Notification;
