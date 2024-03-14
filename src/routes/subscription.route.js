import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import subscriptionControllers from "../controllers/Subscription.controller.js";
const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  subscriptionControllers.BuySubscription
);
router.post(
  "/paymet-intent",
  auth(USER_ROLE.HOMEOWNER),
  subscriptionControllers.createPaymentIntent
);

const SubscriptionRoutes = router;
export default SubscriptionRoutes;
