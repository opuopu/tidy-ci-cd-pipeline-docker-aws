import QueryBuilder from "../builder/QueryBuilder.js";
import GroceryList from "../models/groceryList.model.js";
import UserGroceryList from "../models/userGroceryList.model.js";

const insertUserGroceryListsIntoDB = async (payload) => {
  const result = await UserGroceryList.create(payload);
  return result;
};

const findGroceryFromGroceryLists = async (query) => {
  const goceryListModel = new QueryBuilder(GroceryList.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .sort()
    .select();

  const result = await goceryListModel.modelQuery;
  return {
    result,
  };
};

const deleteUserGrocery = async (id) => {
  const result = await UserGroceryList.findByIdAndDelete(id);
  return result;
};

const userGroceryListServices = {
  insertUserGroceryListsIntoDB,
  findGroceryFromGroceryLists,
  deleteUserGrocery,
};
export default userGroceryListServices;
