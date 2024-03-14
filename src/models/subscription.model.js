import { Schema, model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "package information is required"],
    },
    currency: {
      type: String,
      required: [true, "currency information is required"],
    },
    startDate: {
      type: Date,
      required: [true, "start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "start date is required"],
    },
    transactionId: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = model("Subscription", SubscriptionSchema);
export default Subscription;
