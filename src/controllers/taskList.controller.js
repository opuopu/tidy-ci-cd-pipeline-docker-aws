import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import taskListServices from "../services/taskList.service.js";

const insertTaskListIntoDB = catchAsync(async (req, res) => {
  // const { userId } = req?.user;
  // req.body.homeOwner = userId;
  const result = await taskListServices.insertTaskIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task list inserted successfully",
    data: result,
  });
});
const getAllTaskList = catchAsync(async (req, res) => {
  const result = await taskListServices.getAllTasks(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task lists retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getSingleTask = catchAsync(async (req, res) => {
  const result = await taskListServices.getSingleTask(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task list retrived successfully",
    data: result,
  });
});

const taskListControllers = {
  insertTaskListIntoDB,
  getAllTaskList,
  getSingleTask,
};
export default taskListControllers;
