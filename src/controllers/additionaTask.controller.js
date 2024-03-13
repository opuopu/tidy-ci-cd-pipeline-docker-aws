import httpStatus from "http-status";
import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";
import additionalTaskServices from "../services/additionalTask.service.js";
const insertAdditionalTaskIntoDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await additionalTaskServices.insertAdditionalTaskIntoDb(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks added successfully",
    data: result,
  });
});
const getAllAdditionalTaskByHomeOwner = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.homeOwner = userId;
  const result = await additionalTaskServices.getAllAdditionlTask(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getAllAdditionalTaskByEmployee = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.employee = userId;
  const result = await additionalTaskServices.getAllAditionalTaskByEmployee(
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const deleteAdditionalTask = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.deleteAdditionalTask(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks deleted successfully",
    data: result,
  });
});
const markAsBusy = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.markAsBusy(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks marked as busy successfully",
    data: result,
  });
});
const markAsComplete = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.markAsComplete(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "additional tasks marked as completed successfully",
    data: result,
  });
});
const AprooveReschedule = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.AprooveReschedule(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "re schedule request is approved",
    data: result,
  });
});
const reAsignToOthers = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.AssignToothers(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task assigned successfully",
    data: result,
  });
});
const UpdateAdditionalTask = catchAsync(async (req, res) => {
  const result = await additionalTaskServices.UpdateAdditionalTask(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task assigned successfully",
    data: result,
  });
});
const additionalTaskControllers = {
  insertAdditionalTaskIntoDb,
  getAllAdditionalTaskByHomeOwner,
  getAllAdditionalTaskByEmployee,
  deleteAdditionalTask,
  markAsBusy,
  markAsComplete,
  AprooveReschedule,
  reAsignToOthers,
  UpdateAdditionalTask,
};

export default additionalTaskControllers;
