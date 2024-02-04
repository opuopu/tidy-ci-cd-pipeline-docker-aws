import httpStatus from "http-status";
import employeeServices from "../services/employee.service.js";
import { createFileDetails } from "../utils/createFileDetails.utils.js";
import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";

const getAllEmployees = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.homeOwner = userId;
  const result = await employeeServices.getallFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employees Retrieved  successfully",
    data: result?.data,
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
    req.body.image = createFileDetails(req, "employee", req?.file?.filename);
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

const employeeControllers = {
  getAllEmployees,
  getSingleEmployee,
  updateAnEmployee,
  deleteAnEmployee,
};
export default employeeControllers;
