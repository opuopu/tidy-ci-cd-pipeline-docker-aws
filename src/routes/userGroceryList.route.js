import express from "express";
import userGroceryListControllers from "../controllers/userGroceryList.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.HOMEOWNER),
  userGroceryListControllers.insertUserGroceryListsIntoDB
);

router.get(
  "/homeOwner",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.findGroceryFromGroceryLists
);
router.get(
  "/employee",
  auth(USER_ROLE.EMPLOYEE),
  userGroceryListControllers.getgroceryListByEmployee
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userGroceryListControllers.getuserSingleGroceryList
);
router.patch(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  userGroceryListControllers.updateUserGroceryList
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  userGroceryListControllers.deleteGroceryFromList
);
router.patch(
  "/busy/:id",
  auth(USER_ROLE.EMPLOYEE),
  userGroceryListControllers.markAsBusy
);
router.patch(
  "/completed/:id",
  auth(USER_ROLE.EMPLOYEE),
  userGroceryListControllers.markAsComplete
);
const userGroceryListsRoutes = router;
export default userGroceryListsRoutes;
