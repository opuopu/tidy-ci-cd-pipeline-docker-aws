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
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// filter out deleted documents
roomSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

roomSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
roomSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
const Room = model("Room", roomSchema);
export default Room;
