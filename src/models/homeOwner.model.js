import { Schema, model } from "mongoose";
const homeOwnerSchema = new Schema({
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
  profileImage: {
    publicUrl: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  address: {
    type: String,
  },
});

const HomeOwner = model("HomeOwner", homeOwnerSchema);
export default HomeOwner;
