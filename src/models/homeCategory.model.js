import { Schema, model } from "mongoose";

const homeCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
  },
  {
    timestamps: true,
  }
);

const HomeCategory = model("HomeCategory", homeCategorySchema);
export default HomeCategory;
