import GroceryCategory from "../models/groceryCategory.model.js";
const insertGroceryCategoryIntoDB = async (payload) => {
  const result = await GroceryCategory.create(payload);
  return result;
};
const getAllGroceryCategories = async () => {
  const result = await GroceryCategory.find({});
  return result;
};
const getSingleGroceryCategory = async (id) => {
  const result = await GroceryCategory.findById(id);
  return result;
};

const groceryCategoryServices = {
  insertGroceryCategoryIntoDB,
  getAllGroceryCategories,
  getSingleGroceryCategory,
};
export default groceryCategoryServices;
