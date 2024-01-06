import recipeServices from "../services/recipe.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertRecipeIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const data = {
    ...req.body,
    userId,
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
  const result = await recipeServices.getAllRecipesByQuery(userId);
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

const recipeControllers = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
};
export default recipeControllers;
