import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import taskScheduleService from "../services/workSchedule.service.js";
const insertUserTaskIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await taskScheduleService.insertUserTaskIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "task assigned successfully",
    data: result,
  });
});
const insertBreakTimeIntoDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await taskScheduleService.insertBreakTimeIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "break time added successfully",
    data: result,
  });
});
const getallWorkSchedules = catchAsync(async (req, res) => {
  const result = await taskScheduleService.getAllWorkSchedule(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "work schedules retrived successfully",
    data: result,
  });
});
const getSingleWorkSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.getsingleWorkSchedule(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "work schedules retrived successfully",
    data: result,
  });
});
const updateSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.updateSchedule(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "work schedule updated successfully",
    data: result,
  });
});
const deleteSingleSchedule = catchAsync(async (req, res) => {
  const result = await taskScheduleService.deleteSingleSchedule(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "work schedule deleted successfully",
    data: result,
  });
});

const taskScheduleController = {
  insertUserTaskIntoDB,
  insertBreakTimeIntoDb,
  getallWorkSchedules,
  getSingleWorkSchedule,
  updateSchedule,
  deleteSingleSchedule,
};
export default taskScheduleController;
