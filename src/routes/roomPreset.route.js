import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import roompresetsControllers from "../controllers/roomPreset.controller.js";
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  roompresetsControllers.createRoomPresetIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  roompresetsControllers.getsingRoompreset
);
router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  roompresetsControllers.getAllRoomPresets
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  roompresetsControllers.deleteRoomPreset
);
const roomPresetRoutes = router;
export default roomPresetRoutes;
