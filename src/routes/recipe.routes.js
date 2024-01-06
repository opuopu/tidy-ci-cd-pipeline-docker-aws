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
  "/get-favourite-list/",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.getAllFavoriteRecipes
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  recipeControllers.getAllRecipesByQuery
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
router.patch(
  "/add-to-favourite-list/:id",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.addToFavoriteRecipes
);
router.delete(
  "/remove-from-favourite-list/:id",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.removeRecipeFromFavoritelist
);

const recipeRoutes = router;
export default recipeRoutes;
