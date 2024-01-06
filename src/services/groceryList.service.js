import GroceryList from "../models/groceryList.model.js";

const insertGroceryListIntoDB = async (payload) => {
  const result = await GroceryList.create(payload);
  return result;
};

const getGroceryListsByCategory = async (payload) => {
  const { category } = payload;
  const query = {};
  query["category"] = category;
  const result = await GroceryList.find(query).populate("category");
  return result;
};

const getSingleGroceryList = async (id) => {
  const result = await GroceryList.findById(id).populate("category");
  return result;
};

const groceryListServices = {
  insertGroceryListIntoDB,
  getGroceryListsByCategory,
  getSingleGroceryList,
};
export default groceryListServices;
