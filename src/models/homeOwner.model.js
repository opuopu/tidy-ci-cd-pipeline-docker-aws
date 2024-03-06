import { Schema, model, Types } from "mongoose";
const homeOwnerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    id: {
      type: String,
      required: [true, "id is required"],
      unique: true,
    },
    refferalCode: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    homes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Home",
      },
    ],
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const HomeOwner = model("HomeOwner", homeOwnerSchema);
export default HomeOwner;
