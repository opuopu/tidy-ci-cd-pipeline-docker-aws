import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import notificationControllers from "../controllers/notification.controller.js";
const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  notificationControllers.getUserSpecificNotifications
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  notificationControllers.deleteNotification
);

const notificationRoutes = router;
export default notificationRoutes;
