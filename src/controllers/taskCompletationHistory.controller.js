import httpStatus from "http-status";
import completeHistoryServices from "../services/taskCompletationHistory.service.js";
import sendResponse from "../utils/sendResponse.js";
import catchAsync from "../utils/catchAsync.js";

const getAllHistoryByTaskId = catchAsync(async (req, res) => {
  req.query.task = req.params.id;
  const result = await completeHistoryServices.getAllHistoryByTaskId(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "history retrived  successfully.",
    data: result?.result,
    meta: result?.meta,
  });
});
const deleteAllHistory = catchAsync(async (req, res) => {
  const result = await completeHistoryServices.deleteAllHistory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "history deleted  successfully.",
    data: result,
  });
});

const historyControllers = {
  getAllHistoryByTaskId,
  deleteAllHistory,
};
export default historyControllers;
