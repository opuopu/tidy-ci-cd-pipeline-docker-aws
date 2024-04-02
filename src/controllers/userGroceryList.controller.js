import httpStatus from "http-status";
import userGroceryListServices from "../services/userGroceryLists.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertUserGroceryListsIntoDB = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  if (role === "homeowner") {
    req.body.homeOwner = userId;
  } else if (role === "employee") {
    req.body.employee = userId;
  }
  if (req?.user?.homeOwnerId) {
    req.body.homeOwner = req?.user?.homeOwnerId;
  }

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
const getgroceryListByEmployee = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.employee = userId;

  const result = await userGroceryListServices.getgroceryListByEmployee(
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery Lists Retrived successfully",
    data: result?.result,
    meta: result?.meta,
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
    data: result?.result,
    meta: result?.meta,
  });
});
const findGroceryFromGroceryLists = catchAsync(async (req, res) => {
  console.log(req.body);
  const { userId } = req?.user;
  req.query.homeOwner = userId;
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

const updateUserGroceryList = catchAsync(async (req, res) => {
  const { role, userId } = req.user;
  if (role === "employee") {
    req.body.employee = userId;
  }
  const result = await userGroceryListServices.updateUserGroceryList(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery list updated successfully",
    data: result,
  });
});
const deleteGroceryFromList = catchAsync(async (req, res) => {
  const result = await userGroceryListServices.deleteGroceryFromList(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery list deleted  successfully",
    data: result,
  });
});
const markAsBusy = catchAsync(async (req, res) => {
  const { homeOwnerId } = req?.user || {};
  if (homeOwnerId) {
    req.body.homeOwner = homeOwnerId;
  }
  const result = await userGroceryListServices.markAsBusy(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "grocery list marked as busy successfully",
    data: result,
  });
});
const markAsComplete = catchAsync(async (req, res) => {
  const { homeOwnerId } = req?.user || {};
  if (homeOwnerId) {
    req.body.homeOwner = homeOwnerId;
  }
  const result = await userGroceryListServices.markAsComplete(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "status changed successfully",
    data: result,
  });
});
const sendBuyRequest = catchAsync(async (req, res) => {
  console.log("hitted");
  const { homeOwnerId, userId } = req?.user || {};
  req.body.homeOwner = homeOwnerId;
  req.body.employee = userId;
  const result = await userGroceryListServices.sendBuyRequest(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "request sent successfully",
    data: result,
  });
});
const acceptBuyRequest = catchAsync(async (req, res) => {
  console.log("hitted");
  const result = await userGroceryListServices.AcceptBuyRequest(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "request approved successfully",
    data: result,
  });
});
const DeclineRequest = catchAsync(async (req, res) => {
  const result = await userGroceryListServices.declineBuyRequest(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "request declined successfully",
    data: result,
  });
});
const userGroceryListControllers = {
  insertUserGroceryListsIntoDB,
  findGroceryFromGroceryLists,
  getgroceryListByEmployee,
  getuserSingleGroceryList,
  updateUserGroceryList,
  deleteGroceryFromList,
  markAsBusy,
  markAsComplete,
  sendBuyRequest,
  acceptBuyRequest,
  DeclineRequest,
};
export default userGroceryListControllers;
