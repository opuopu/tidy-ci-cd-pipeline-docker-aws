import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import roomControllers from "../controllers/room.controlller.js";
const router = express.Router();

router.post("/", auth(USER_ROLE.HOMEOWNER), roomControllers.inserRoomIntoDB);
router.post(
  "/single",
  auth(USER_ROLE.HOMEOWNER),
  roomControllers.insertSingleRoomIntoDb
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  roomControllers.getRoomsByQuery
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  roomControllers.getSingleRoom
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  roomControllers.updateRoom
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  roomControllers.deleteRoom
);
const roomRoutes = router;
export default roomRoutes;
