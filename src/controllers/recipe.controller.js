import httpStatus from "http-status";
import recipeServices from "../services/recipe.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertRecipeIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  console.log("body", req.body);
  const data = {
    ...req.body,
    user: userId,
  };
  const result = await recipeServices.insertRecipeIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipe created successfully",
    data: result,
  });
});

const getAllRecipesByQuery = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.user = userId;
  const result = await recipeServices.getAllRecipesByQuery(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipes retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getAllUsersRecipesByQuery = catchAsync(async (req, res) => {
  const result = await recipeServices.getAllUsersRecipesByQuery(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipes retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getSingleRecipe = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.getSingleRecipe(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipe retrived successfully",
    data: result,
  });
});
const updateRecipe = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.updateRecipe(
    req.params.id,
    userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipe updated successfully",
    data: result,
  });
});
const deleteRecipe = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.deleteRecipe(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipe deleted successfully",
    data: result,
  });
});
const addToFavoriteRecipes = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.addToFavoriteRecipes(
    userId,
    req.body.recipeId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipe successfully added to favorite lists",
    data: result,
  });
});
const getMyFavouriteRecipe = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.user = userId;
  const result = await recipeServices.getFavouriteRecipes(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FavouriteRecipes Retrived successfully",
    data: result,
  });
});
const removeFromFavouriteList = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.user = userId;
  const result = await recipeServices.deleteFromFavoriteRecipes(
    userId,
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe Deleted Successfully",
    data: result,
  });
});

const recipeControllers = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getAllUsersRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  addToFavoriteRecipes,
  getMyFavouriteRecipe,
  removeFromFavouriteList,
};
export default recipeControllers;
