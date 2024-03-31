import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import Employee from "../models/employee.model.js";
import AdditionalTask from "../models/additionalTask.model.js";
import UserGroceryList from "../models/userGroceryList.model.js";

const getAllEmployees = async (query) => {
  const EmployeeQuery = new QueryBuilder(
    Employee.find().populate("user"),
    query
  )
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await EmployeeQuery.modelQuery;
  const meta = await EmployeeQuery.meta();
  return {
    result,
    meta,
  };
};

const getSingleEmployee = async (id) => {
  const result = await Employee.findById(id);
  return result;
};
const updateEmployee = async (id, payload) => {
  const { password, homeOwner } = payload;
  if (password || homeOwner) {
    throw new AppError(httpStatus.BAD_REQUEST, "something went wrong");
  }
  const result = await Employee.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteEmployee = async (id) => {
  const result = await Employee.findByIdAndDelete(id);
  return result;
};

const GetTotalAdditionalTask = async (query) => {
  if (!query?.employee) {
    return null;
  }
  const result = await AdditionalTask.find(query);
  return result;
};
const GetTotalGroceries = async (query) => {
  if (!query?.employee) {
    return [];
  }
  const result = await UserGroceryList.find(query);
  return result;
};
const employeeServices = {
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
  GetTotalAdditionalTask,
  GetTotalGroceries,
};
export default employeeServices;
