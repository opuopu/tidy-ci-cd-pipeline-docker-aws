import httpStatus from "http-status";
import subscriptionServices from "../services/subscription.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await subscriptionServices.createPaymentIntent();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "client secret retrived successfully",
    data: result,
  });
});
const BuySubscription = catchAsync(async (req, res) => {
  req.body.user = req?.user?.userId;
  const result = await subscriptionServices.BuySubscription(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Congratulations. Your Subscription was successfully",
    data: result,
  });
});
const subscriptionControllers = {
  createPaymentIntent,
  BuySubscription,
};
export default subscriptionControllers;
