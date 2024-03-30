import express from "express";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import recipeControllers from "../controllers/recipe.controller.js";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.addToFavoriteRecipes
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.getMyFavouriteRecipe
);
router.delete(
  "/:id",
  auth(USER_ROLE.HOMEOWNER),
  recipeControllers.removeFromFavouriteList
);

const FavouriteRecipeRoutes = router;
export default FavouriteRecipeRoutes;
