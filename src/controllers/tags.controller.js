import httpStatus from "http-status";
import tagservices from "../services/tags.service.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const insertTagIntoDB = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const data = {
    ...req.body,
    user: userId,
  };
  const result = await tagservices.insertTagIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tag created successfully.",
    data: result,
  });
});

const getAllTagsByQuery = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await tagservices.getAllTagsByQuery(userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tags retrived successfully.",
    data: result,
  });
});
const getsingleTag = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await tagservices.getAllTagsByQuery(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tag retrived successfully.",
    data: result,
  });
});
const updateTags = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await tagservices.updateTags(req.params.id, userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tag updated successfully.",
    data: result,
  });
});
const deleteTag = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await tagservices.deleteTag(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "tag deleted successfully.",
    data: result,
  });
});

const tagsControllers = {
  insertTagIntoDB,
  getAllTagsByQuery,
  getsingleTag,
  updateTags,
  deleteTag,
};
export default tagsControllers;
