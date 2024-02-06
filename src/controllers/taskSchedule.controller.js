import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import taskScheduleService from "../services/taskSchedule.service.js";
import dayjs from "dayjs";
const insertUserTaskIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;

  req.body.date = dayjs(req?.body?.date).format("YYYY-MM-DD");
  const result = await taskScheduleService.insertUserTaskIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user task created successfully",
    data: result,
  });
});
const getAllTaskSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.getAllTaskSchedule(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task schedules retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const getSingleTaskSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.getSingleTask(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task schedule retrived successfully",
    data: result,
  });
});
const addGroceriesIntoTask = catchAsync(async (req, res) => {
  const result = await taskScheduleService.addGroceriesIntoTask(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "groceries added successfully",
    data: result,
  });
});
const changeTaskStatus = catchAsync(async (req, res) => {
  const result = await taskScheduleService.changeTaskStatus(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task status updated successfully",
    data: result,
  });
});
const reAssignTask = catchAsync(async (req, res) => {
  req.body.date = dayjs(req?.body?.date).format("YYYY-MM-DD");
  const result = await taskScheduleService.reAssignTask(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task re asigned  successfully",
    data: result,
  });
});
const removeGroceriesFromTask = catchAsync(async (req, res) => {
  const result = await taskScheduleService.removeGroceriesFromTask(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "groceries deleted successfully",
    data: result,
  });
});
const updateTaskSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.updateTask(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task schedule updated successfully",
    data: result,
  });
});
const scheduleTask = catchAsync(async (req, res) => {
  const result = await taskScheduleService.sentReminder();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task scheduled successfully",
    data: result,
  });
});

const taskScheduleController = {
  insertUserTaskIntoDB,
  getAllTaskSchedule,
  getSingleTaskSchedule,
  addGroceriesIntoTask,
  removeGroceriesFromTask,
  changeTaskStatus,
  reAssignTask,
  updateTaskSchedule,
  scheduleTask,
};
export default taskScheduleController;
