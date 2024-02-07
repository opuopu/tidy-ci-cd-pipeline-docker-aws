import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "room title is required"],
    },
    home: {
      type: Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    color: {
      type: String,
      required: [true, "color code is required"],
      enum: ["#E7F9F0", "#FFFCEF", "#FFF4E5", "#CEEFE7", "#D9EFF0"],
    },
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);
export default Room;
