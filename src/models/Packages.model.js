import { Schema, model } from "mongoose";

const PackageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "package name is required"],
    },
    price: {
      type: Number,
      required: [true, "package price is required"],
    },
    duration: {
      type: String,
      required: [true, "package duration is required"],
    },
  },

  {
    timestamps: true,
  }
);

const Packages = model("Package", PackageSchema);
export default Packages;
