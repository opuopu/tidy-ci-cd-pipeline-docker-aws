import httpStatus from "http-status";
import notificationServices from "../services/notification.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const getUserSpecificNotifications = catchAsync(async (req, res) => {
  const { userId } = req.user;
  req.query.receiver = "66010b65f76bcbc6f312771f";
  const result = await notificationServices.getUserSpecificNotifications(
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "notifications retrived successfully",
    data: result?.result,
    meta: result?.meta,
  });
});
const deleteNotification = catchAsync(async (req, res) => {
  const result = await notificationServices.deleteNotification(req?.parmas?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "notifications deleted successfully",
    data: result,
  });
});

const notificationControllers = {
  getUserSpecificNotifications,
  deleteNotification,
};
export default notificationControllers;
