import express from "express";
import userGroceryListControllers from "../controllers/userGroceryList.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.insertUserGroceryListsIntoDB
);
router.get(
  "/all",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.getUserGroceryLists
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userGroceryListControllers.findGroceryFromGroceryLists
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userGroceryListControllers.getuserSingleGroceryList
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.deleteSingleGrocery
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.deleteUserGrocery
);
const userGroceryListsRoutes = router;
export default userGroceryListsRoutes;
