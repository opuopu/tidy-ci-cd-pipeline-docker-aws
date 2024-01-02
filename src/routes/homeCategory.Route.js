import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import homeCategoryControllers from "../controllers/homeCategory.controller.js";
const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.HOMEOWNER),
  homeCategoryControllers.createHomeCategory
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  homeCategoryControllers.getAllHomeCategories
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  homeCategoryControllers.getSingleHomeCategory
);
const homeCategoryRoutes = router;
export default homeCategoryRoutes;
