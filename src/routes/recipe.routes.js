import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import recipeControllers from "../controllers/recipe.controller.js";

const router = express.Router();
router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.insertRecipeIntoDB
);
router.get(
  auth(USER_ROLE.HOMEOWNER),
  "/",
  recipeControllers.getAllRecipesByQuery
);
router.get(
  "/all",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  recipeControllers.getAllUsersRecipesByQuery
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  recipeControllers.getSingleRecipe
);
router.patch("/:id", auth(USER_ROLE.HOMEOWNER), recipeControllers.updateRecipe);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.deleteRecipe
);

const recipeRoutes = router;
export default recipeRoutes;
