import httpStatus from "http-status";
import groceryCategoryServices from "../services/GroceryCategory.Service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertGroceryCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await groceryCategoryServices.insertGroceryCategoryIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery Category created successfully",
    data: result,
  });
});
const getAllGroceryCategories = catchAsync(async (req, res) => {
  const result = await groceryCategoryServices.getAllGroceryCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery Categories retrived successfully",
    data: result,
  });
});
const getSingleGroceryCategory = catchAsync(async (req, res) => {
  const result = await groceryCategoryServices.getSingleGroceryCategory(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Grocery Category retrived successfully",
    data: result,
  });
});

const groceryCategoryControllers = {
  insertGroceryCategoryIntoDB,
  getAllGroceryCategories,
  getSingleGroceryCategory,
};
export default groceryCategoryControllers;
