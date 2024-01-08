import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import HomeOwner from "../models/homeOwner.model.js";
import Recipe from "../models/recipe.model.js";
import QueryBuilder from "../builder/QueryBuilder.js";

const insertRecipeIntoDB = async (payload) => {
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

const addToFavoriteRecipes = async (id, userId) => {
  const checkifExistinFavouriteList = await Recipe.findOne({
    _id: id,
    user: userId,
    favouriteList: true,
  });
  if (checkifExistinFavouriteList) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "recipe already exist in favourite list"
    );
  }
  const result = await Recipe.findOneAndUpdate(
    { _id: id, user: userId },
    {
      favouriteList: true,
    },
    { new: true }
  );
  return result;
};
const getAllFavoriteRecipes = async (userId) => {
  const query = {
    user: userId,
    favouriteList: true,
  };
  const recipeQuery = new QueryBuilder(Recipe.find(), query)
    .search()
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
const removeRecipeFromFavoritelist = async (id, userId) => {
  const result = await Recipe.findOneAndUpdate(
    { $and: [{ _id: id, user: userId }] },
    {
      $set: {
        favouriteList: false,
      },
    },
    { new: true }
  );

  return result;
};
const recipeServices = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  addToFavoriteRecipes,
  getAllFavoriteRecipes,
  removeRecipeFromFavoritelist,
};
export default recipeServices;
