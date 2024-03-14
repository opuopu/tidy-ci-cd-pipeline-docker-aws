import Stripe from "stripe";
import config from "../config/index.js";
import { calculateAmount } from "../utils/subscription.utils.js";
import Packages from "../models/packages.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import { nextMonth, nextYear } from "../utils/schedule.utils.js";
const stripe = new Stripe(config.stripe_secret);
import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import HomeOwner from "../models/homeOwner.model.js";
const createPaymentIntent = async (payload) => {
  const { amount } = payload;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateAmount(amount),
    currency: "usd",
    payment_method_types: ["card"],
  });

  return paymentIntent?.client_secret;
};

const BuySubscription = async (payload) => {
  console.log(payload);
  const findPackage = await Packages.findById(payload?.package);

  const findUserSubscription = await Subscription.findOne({
    user: payload?.user,
  });

  if (!findPackage) {
    throw new AppError(httpStatus.BAD_REQUEST, "package not found");
  }
  const date = new Date();
  let endDate;
  if (findPackage?.duration === "monthly") {
    endDate = nextMonth(date);
  } else if (findPackage?.duration === "yearly") {
    endDate = nextYear(date);
  }

  const formatedData = {
    ...payload,
    startDate: date,
    endDate: endDate,
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (findUserSubscription) {
      await Subscription.findByIdAndUpdate(
        findUserSubscription?._id,
        {
          $set: {
            status: false,
          },
        },
        { session }
      );
    }
    const result = await Subscription.create([formatedData], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to buy subscriptions");
    }
    await User.findByIdAndUpdate(
      payload?.user,
      {
        $set: {
          trialExpirationDate: endDate,
          trial: "premium",
        },
      },
      { session }
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const subscriptionServices = {
  createPaymentIntent,
  BuySubscription,
};

export default subscriptionServices;
