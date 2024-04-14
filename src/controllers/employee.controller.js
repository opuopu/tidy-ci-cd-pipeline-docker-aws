import httpStatus from "http-status";
import employeeServices from "../services/employee.service.js";

import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";
import { createFileDetails } from "../utils/file.utils.js";

const getAllEmployees = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.homeOwner = userId;
  const result = await employeeServices.getAllEmployees(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employees Retrieved  successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getSingleEmployee = catchAsync(async (req, res) => {
  const result = await employeeServices.getSingleEmployee(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee Retrieved  successfully",
    data: result,
  });
});
const updateAnEmployee = catchAsync(async (req, res) => {
  if (req?.file) {
    req.body.image = createFileDetails(req, "profile", req?.file?.filename);
  }
  const result = await employeeServices.updateEmployee(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee updated successfully",
    data: result,
  });
});
const deleteAnEmployee = catchAsync(async (req, res) => {
  const result = await employeeServices.deleteEmployee(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee deleted successfully",
    data: result,
  });
});
const AdditionalTask = catchAsync(async (req, res) => {
  req.query.employee = req.user.userId;
  const result = await employeeServices.GetTotalAdditionalTask(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "data retrived successfully",
    data: result,
  });
});
const GetTotalGroceries = catchAsync(async (req, res) => {
  console.log(req.user);
  req.query.employee = req.user.userId;
  const result = await employeeServices.GetTotalGroceries(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "data retrived successfully",
    data: result,
  });
});
const sendEmailAndPassword = catchAsync(async (req, res) => {
  const result = await employeeServices.sendEmailAndPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "email sent  successfully",
    data: result,
  });
});

const employeeControllers = {
  getAllEmployees,
  getSingleEmployee,
  updateAnEmployee,
  deleteAnEmployee,
  AdditionalTask,
  GetTotalGroceries,
  sendEmailAndPassword,
};
export default employeeControllers;
