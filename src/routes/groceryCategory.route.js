import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import groceryCategoryControllers from "../controllers/groceryCategory.controller.js";
const groceryCategoryRoutes = router;
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  groceryCategoryControllers.insertGroceryCategoryIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  groceryCategoryControllers.getAllGroceryCategories
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  groceryCategoryControllers.getSingleGroceryCategory
);
export default groceryCategoryRoutes;
