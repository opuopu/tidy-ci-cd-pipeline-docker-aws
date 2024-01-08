import httpStatus from "http-status";
import recipeServices from "../services/recipe.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertRecipeIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
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
  const query = {
    user: userId,
    ...req.query,
  };
  const result = await recipeServices.getAllRecipesByQuery(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "recipes retrived successfully",
    data: result,
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
    req.params.id,
    userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe successfully added to your favorites!",
    data: result,
  });
});
const getAllFavoriteRecipes = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.getAllFavoriteRecipes(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "favourite recipes retrived successfully",
    data: result,
  });
});
const removeRecipeFromFavoritelist = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await recipeServices.removeRecipeFromFavoritelist(
    req.params.id,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe successfully removed from the list.",
    data: result,
  });
});

const recipeControllers = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  addToFavoriteRecipes,
  getAllFavoriteRecipes,
  removeRecipeFromFavoritelist,
};
export default recipeControllers;
