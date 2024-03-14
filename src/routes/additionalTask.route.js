import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import additionalTaskControllers from "../controllers/additionaTask.controller.js";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.insertAdditionalTaskIntoDb
);
router.get(
  "/home-owner",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.getAllAdditionalTaskByHomeOwner
);
router.get(
  "/employee",
  auth(USER_ROLE.EMPLOYEE),
  additionalTaskControllers.getAllAdditionalTaskByEmployee
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.UpdateAdditionalTask
);
router.patch(
  "/re-schedule/:id",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.UpdateAdditionalTask
);

router.patch(
  "/busy/:id",
  auth(USER_ROLE.EMPLOYEE),
  additionalTaskControllers.markAsBusy
);
router.patch(
  "/completed/:id",
  auth(USER_ROLE.EMPLOYEE),
  additionalTaskControllers.markAsComplete
);
router.patch(
  "/approve-reschedule/:id",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.AprooveReschedule
);
router.patch(
  "/assign-to-others",
  auth(USER_ROLE.HOMEOWNER),
  additionalTaskControllers.reAsignToOthers
);

const additionalTaskRoutes = router;
export default additionalTaskRoutes;
