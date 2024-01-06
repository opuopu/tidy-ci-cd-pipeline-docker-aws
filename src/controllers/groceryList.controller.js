import httpStatus from "http-status";
import groceryListServices from "../services/groceryList.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertGroceryListIntoDB = catchAsync(async (req, res) => {
  const result = await groceryListServices.insertGroceryListIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery item added successfully",
    data: result,
  });
});

const getGroceryListsByCategory = catchAsync(async (req, res) => {
  const result = await groceryListServices.getGroceryListsByCategory(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery items retrived successfully",
    data: result,
  });
});
const getSingleGroceryList = catchAsync(async (req, res) => {
  const result = await groceryListServices.getSingleGroceryList(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery item retrived successfully",
    data: result,
  });
});

const groceryListControllers = {
  insertGroceryListIntoDB,
  getGroceryListsByCategory,
  getSingleGroceryList,
};
export default groceryListControllers;
