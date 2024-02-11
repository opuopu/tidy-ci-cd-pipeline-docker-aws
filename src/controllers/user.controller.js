import httpStatus from "http-status";
import userServices from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { createFileDetails } from "../utils/file.utils.js";

const getme = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await userServices.getme(userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user profile retrived successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  if (req?.file) {
    req.body.image = createFileDetails("profile", req?.file?.filename);
  }
  const result = await userServices.updateMyProfile(userId, role, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user profile updated successfully",
    data: result,
  });
});
const userControllers = {
  getme,
  updateMyProfile,
};
export default userControllers;
