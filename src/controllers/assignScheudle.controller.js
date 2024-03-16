import httpStatus from "http-status";
import AssignScheduleServices from "../services/assignSchedule.service.js";
import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";
const insertScheduleIntoDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await AssignScheduleServices.insertScheduleIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "done",
    data: result,
  });
});
const getAssignedSchedule = catchAsync(async (req, res) => {
  const result = await AssignScheduleServices.getAssignedSchedule(
    req.params.employeeId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "assign schedule retrived successfully",
    data: result,
  });
});
const updateAssignSchedule = catchAsync(async (req, res) => {
  const result = await AssignScheduleServices.updateAssignSchedule(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "assign schedule updated successfully",
    data: result,
  });
});

const AssignScheduleControllers = {
  insertScheduleIntoDb,
  updateAssignSchedule,
};
export default AssignScheduleControllers;
