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
    preset: {
      type: Schema.Types.ObjectId,
      ref: "RoomPreset",
    },
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);
export default Room;
