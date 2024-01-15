import httpStatus from "http-status";
import TaskCategory from "../models/taskCategory.model.js";
import taskCategoryServices from "../services/taskCategory.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertTaskCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await taskCategoryServices.insertTaskCategoryIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task category created  successfully.",
    data: result,
  });
});
const getAllTaskCategoires = catchAsync(async (req, res) => {
  const result = await taskCategoryServices.getAllTaskCategoires();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task categories retrived   successfully.",
    data: result,
  });
});
const getsingleTaskCategory = catchAsync(async (req, res) => {
  const result = await taskCategoryServices.getsingleTaskCategory(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task category retrived   successfully.",
    data: result,
  });
});
const taskCategoryControllers = {
  insertTaskCategoryIntoDB,
  getAllTaskCategoires,
  getsingleTaskCategory,
};
export default taskCategoryControllers;
