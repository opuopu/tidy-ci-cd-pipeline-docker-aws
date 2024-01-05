import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import tagsControllers from "../controllers/tags.controller.js";

const router = express.Router();

router.post("/", auth(USER_ROLE.HOMEOWNER), tagsControllers.insertTagIntoDB);
router.get("/", auth(USER_ROLE.HOMEOWNER), tagsControllers.getAllTagsByQuery);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  tagsControllers.getAllTagsByQuery
);
router.patch("/:id", auth(USER_ROLE.HOMEOWNER), tagsControllers.updateTags);
router.delete("/:id", auth(USER_ROLE.HOMEOWNER), tagsControllers.deleteTag);
const tagsRoutes = router;
export default tagsRoutes;
