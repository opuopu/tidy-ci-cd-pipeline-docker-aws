import { Schema, model } from "mongoose";

const roomPresetSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "preset title is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomPreset = model("RoomPreset", roomPresetSchema);
export default RoomPreset;
