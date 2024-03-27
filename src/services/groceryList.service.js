import QueryBuilder from "../builder/QueryBuilder.js";
import GroceryList from "../models/groceryList.model.js";

const insertGroceryListIntoDB = async (payload) => {
  const result = await GroceryList.create(payload);
  return result;
};

const getGroceryListsByCategory = async (query) => {
  const GroceryListModel = new QueryBuilder(GroceryList.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await GroceryListModel.modelQuery;
  const meta = await GroceryListModel.meta();
  return {
    result,
    meta,
  };
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
