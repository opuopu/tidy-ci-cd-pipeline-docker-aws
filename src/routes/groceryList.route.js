import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import groceryListControllers from "../controllers/groceryList.controller.js";

const router = express.Router();

const groceryListRoutes = router;

router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  groceryListControllers.insertGroceryListIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  groceryListControllers.getGroceryListsByCategory
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  groceryListControllers.getSingleGroceryList
);
export default groceryListRoutes;
