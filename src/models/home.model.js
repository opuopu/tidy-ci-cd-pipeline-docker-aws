import { Schema, model } from "mongoose";
const homeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user id is required"],
      ref: "User",
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
homeSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

homeSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
homeSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
const Home = model("Home", homeSchema);
export default Home;
