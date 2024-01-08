import { Schema, model } from "mongoose";

const tagsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "tags is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Tags = model("Tags", tagsSchema);
export default Tags;
