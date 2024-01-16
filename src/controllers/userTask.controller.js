import httpStatus from "http-status";
import userTaskServices from "../services/userTask.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertUserTaskIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.body.homeOwner = userId;
  const result = await userTaskServices.insertUserTaskIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user task created successfully",
    data: result,
  });
});

const userTaskControllers = {
  insertUserTaskIntoDB,
};
export default userTaskControllers;
