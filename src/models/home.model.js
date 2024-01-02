import { Schema, model } from "mongoose";

const homeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Home = model("Home", homeSchema);
export default Home;
