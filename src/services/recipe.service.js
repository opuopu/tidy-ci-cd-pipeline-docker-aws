import Recipe from "../models/recipe.model.js";

const insertRecipeIntoDB = async (payload) => {
  const result = await Recipe.create(payload);
  return result;
};

const getAllRecipesByQuery = async (userId, payload) => {
  const query = {};
  query["user"] = userId;
  if (payload.searchTerm)
    query.name = { $regex: payload.searchTerm, $options: "i" };
  const result = await Recipe.find(query).populate("user");
  return result;
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
  const result = await Recipe.findByIdAndDelete({
    $and: [{ _id: id }, { user: userId }],
  });
  return result;
};
const recipeServices = {
  insertRecipeIntoDB,
  getAllRecipesByQuery,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
};
export default recipeServices;
