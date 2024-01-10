import QueryBuilder from "../builder/QueryBuilder.js";
import GroceryList from "../models/groceryList.model.js";
import UserGroceryList from "../models/userGroceryList.model.js";

const insertUserGroceryListsIntoDB = async (payload) => {
  const result = await UserGroceryList.create(payload);
  return result;
};

const findGroceryFromGroceryLists = async (query) => {
  console.log(query);
  const goceryListModel = new QueryBuilder(GroceryList.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await goceryListModel.modelQuery;
  return result;
};

const getUserGroceryLists = async (query) => {
  const UserListModel = new QueryBuilder(UserGroceryList.find(), query)
    .search()
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await UserListModel.modelQuery;
  const meta = await UserListModel.meta();
  return {
    meta,
    result,
  };
};
const getuserSingleGroceryList = async (id) => {
  const result = await UserGroceryList.findById(id).populate("homeOwner");

  return result;
};
const deleteUserGrocery = async (id) => {
  const result = await UserGroceryList.findByIdAndDelete(id);
  return result;
};
const deleteSingleGrocery = async (id, groceryId) => {
  const result = await UserGroceryList.findByIdAndUpdate(id, {
    $pull: {
      groceryLists: groceryId,
    },
  });
  return result;
};
const userGroceryListServices = {
  insertUserGroceryListsIntoDB,
  findGroceryFromGroceryLists,

  getUserGroceryLists,
  getuserSingleGroceryList,
  deleteUserGrocery,
  deleteSingleGrocery,
};
export default userGroceryListServices;
