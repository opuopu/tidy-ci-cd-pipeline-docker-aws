import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import subscriptionControllers from "../controllers/Subscription.controller.js";

import paymentValidation from "../validation/payment.validation.js";
import validateRequest from "../middlewares/validateRequest.js";
const router = express.Router();
router.post(
  "/",
  validateRequest(paymentValidation.subscriptionSchema),
  auth(USER_ROLE.HOMEOWNER),
  subscriptionControllers.BuySubscription
);
router.post(
  "/paymet-intent",
  validateRequest(paymentValidation.paymentIntentSchema),
  auth(USER_ROLE.HOMEOWNER),
  subscriptionControllers.createPaymentIntent
);

const SubscriptionRoutes = router;
export default SubscriptionRoutes;
