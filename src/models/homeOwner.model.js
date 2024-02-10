import { Schema, model } from "mongoose";
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
    refferalCode: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const HomeOwner = model("HomeOwner", homeOwnerSchema);
export default HomeOwner;
