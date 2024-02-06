import httpStatus from "http-status";
import notificationServices from "../services/notification.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const getUserSpecificNotifications = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await notificationServices.getUserSpecificNotifications(
    userId
  );
  sendResponse(res, {
    status: httpStatus.OK,
    message: "notifications retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const deleteNotification = catchAsync(async (req, res) => {
  const result = await notificationServices.deleteNotification(req?.parmas?.id);
  sendResponse(res, {
    status: httpStatus.OK,
    message: "notifications deleted successfully",
    data: result,
  });
});

const notificationControllers = {
  getUserSpecificNotifications,
  deleteNotification,
};
export default notificationControllers;
