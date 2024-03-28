import Recipe from "../models/recipe.model.js";
import QueryBuilder from "../builder/QueryBuilder.js";
import FavouriteRecipe from "../models/favouriteRecipe.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import { Schema, Types } from "mongoose";
const insertRecipeIntoDB = async (payload) => {
  const result = await Recipe.create(payload);
  return result;
};

const getAllRecipesByQuery = async (query) => {
  console.log(query);
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
    .notEqual({ user: query?.user })
    .paginate()
    .sort()
    .fields();
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
  const result = await Recipe.findByIdAndUpdate(
    id,
    {
      $set: {
        status: false,
      },
    },
    { new: true }
  );
  return result;
};

const addToFavoriteRecipes = async (userId, recipeId) => {
  const myFavouriteList = await FavouriteRecipe.findOne({}).select("lists");
  if (myFavouriteList?.lists?.includes(recipeId)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "recipe already in the favorites list"
    );
  }
  const result = await FavouriteRecipe.findOneAndUpdate(
    { user: userId },
    { $addToSet: { lists: recipeId } },
    { new: true, upsert: true }
  ).populate("lists");
  return result;
};

const getFavouriteRecipes = async (query) => {
  const result = await FavouriteRecipe.findOne(query).populate("lists");
  return result;
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
