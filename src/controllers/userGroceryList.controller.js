import httpStatus from "http-status";
import userGroceryListServices from "../services/userGroceryLists.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertUserGroceryListsIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await userGroceryListServices.insertUserGroceryListsIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user grocery lists inserted successfully",
    data: result,
  });
});
const getUserGroceryLists = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.homeOwner = userId;
  const result = await userGroceryListServices.getUserGroceryLists(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery Lists Retrived successfully",
    data: result,
  });
});
const getuserSingleGroceryList = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.homeOwner = userId;
  const result = await userGroceryListServices.getuserSingleGroceryList(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery List Retrived successfully",
    data: result,
  });
});
const findGroceryFromGroceryLists = catchAsync(async (req, res) => {
  const result = await userGroceryListServices.findGroceryFromGroceryLists(
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery Lists Retrived successfully",
    data: result,
  });
});
const deleteUserGrocery = catchAsync(async (req, res) => {
  const result = await userGroceryListServices.deleteUserGrocery(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery list deleted  successfully",
    data: result,
  });
});
const deleteSingleGrocery = catchAsync(async (req, res) => {
  const result = await userGroceryListServices.deleteSingleGrocery(
    req.params.id,
    req.body.groceryId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery item removed   successfully",
    data: result,
  });
});

const userGroceryListControllers = {
  insertUserGroceryListsIntoDB,
  findGroceryFromGroceryLists,
  getUserGroceryLists,
  getuserSingleGroceryList,
  deleteUserGrocery,
  deleteSingleGrocery,
};
export default userGroceryListControllers;
