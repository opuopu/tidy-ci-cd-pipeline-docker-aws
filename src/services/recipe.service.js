import Recipe from "../models/recipe.model.js";
import QueryBuilder from "../builder/QueryBuilder.js";
import FavouriteRecipe from "../models/favouriteRecipe.model.js";
const insertRecipeIntoDB = async (payload) => {
  console.log(payload);
  const result = await Recipe.create(payload);
  return result;
};

const getAllRecipesByQuery = async (query) => {
  const recipeQuery = new QueryBuilder(Recipe.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .sort();
  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.meta();
  return {
    meta,
    result,
  };
};
const getAllUsersRecipesByQuery = async (query) => {
  const recipeQuery = new QueryBuilder(Recipe.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .sort();
  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.meta();
  return {
    meta,
    result,
  };
};

const getSingleRecipe = async (id, userId) => {
  const result = await Recipe.findOne({
    $and: [{ _id: id }, { user: userId }],
  }).populate("user");
  return result;
};

const updateRecipe = async (id, userId, payload) => {
  const result = await Recipe.findOneAndUpdate(
    {
      $and: [{ _id: id }, { user: userId }],
    },
    payload,
    { new: true }
  ).populate("user");
  return result;
};

const deleteRecipe = async (id, userId) => {
  const result = await Recipe.findOneAndDelete({
    $and: [{ _id: id }, { user: userId }],
  });
  return result;
};

const addToFavoriteRecipes = async (userId, recipeId) => {
  const result = await FavouriteRecipe.findOneAndUpdate(
    { user: userId },
    { $addToSet: { lists: recipeId } },
    { new: true },
    { upsert: true }
  );
  return result;
};

const getFavouriteRecipes = async (query) => {
  const result = await FavouriteRecipe.findOne(query).populate("lists");
  return result?.lists;
};

const deleteFromFavoriteRecipes = async (userId, recipeId) => {
  const result = await FavouriteRecipe.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        lists: recipeId,
      },
    },
    { new: true }
  );
  return result;
};

const recipeServices = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getAllUsersRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  addToFavoriteRecipes,
  getFavouriteRecipes,
  deleteFromFavoriteRecipes,
};
export default recipeServices;
