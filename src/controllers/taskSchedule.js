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
const taskScheduleController = {
  insertUserTaskIntoDB,
};
export default taskScheduleController;
