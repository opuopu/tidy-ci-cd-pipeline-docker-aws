import httpStatus from "http-status";
import { TaskNotifcationMessage } from "../constant/notificationMessae.js";
import AdditionalTask from "../models/additionalTask.model.js";
import mongoose from "mongoose";
import { emitMessage } from "../utils/socket.utils.js";
import { nextMonth, nextWeekDay } from "../utils/schedule.utils.js";
import notificationServices from "./notification.service.js";
import QueryBuilder from "../builder/QueryBuilder.js";
import TaskCompletationHistory from "../models/taskCompleteHistory.model.js";
import AppError from "../errors/AppError.js";
const insertAdditionalTaskIntoDb = async (payload) => {
  const { assignedDate } = payload;
  let status;
  if (payload.recurrence === "weekly" || payload.recurrence === "monthly") {
    status = "ongoing";
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.create({
      ...payload,
      nextOccurrence: assignedDate,
      status,
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to assign task");
    }
    emitMessage(payload?.employee, TaskNotifcationMessage.additional);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: payload.employee,
          refference: result?._id,
          message: TaskNotifcationMessage.additional,
          type: "additional",
        },
      ],
      session
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAllAdditionlTask = async (query) => {
  console.log(query);
  const additionalTaskModel = new QueryBuilder(AdditionalTask.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await additionalTaskModel.modelQuery;
  const meta = await additionalTaskModel.meta();
  return {
    result,
    meta,
  };
};
const getAllAditionalTaskByEmployee = async (query) => {
  const userAdditionalTaskModel = new QueryBuilder(AdditionalTask.find(), query)
    .search()
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await userAdditionalTaskModel.modelQuery;
  const meta = await userAdditionalTaskModel.meta();
  return {
    meta,
    result,
  };
};
const getSingleAdditionalTask = async (id) => {
  const result = await AdditionalTask.findById(id).populate(
    "homeOwner employee"
  );
  return result;
};
const deleteAdditionalTask = async (id) => {
  const result = await AdditionalTask.findByIdAndDelete(id);
  return result;
};
const markAsBusy = async (id, payload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "busy",
          note: payload?.note,
          "preferableTime.date": payload?.preferableDate,
          "preferableTime.time": payload?.preferableTime,
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "failed to update. please try again"
      );
    }
    emitMessage(result?.homeOwner, TaskNotifcationMessage.busy);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: result?.homeOwner,
          refference: result?._id,
          message: TaskNotifcationMessage.busy,
          type: "task",
        },
      ],
      session
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const markAsComplete = async (id, payload) => {
  const session = await mongoose.startSession();
  const findTask = await AdditionalTask.findById(id);
  if (findTask?.recurrence === "weekly") {
    payload.nextOccurrence = nextWeekDay(findTask?.nextOccurrence);
  } else if (findTask?.recurrence === "monthly") {
    payload.nextOccurrence = nextMonth(findTask?.nextOccurrence);
  } else if (findTask?.recurrence === "onetime") {
    payload.status = "complete";
  }
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "failed to update. please try again"
      );
    }
    const insertIntoHistory = await TaskCompletationHistory.create(
      [
        {
          task: result?._id,
          date: new Date(),
          type: "additional",
        },
      ],
      { session }
    );
    if (!insertIntoHistory) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "failed to update history.please try again"
      );
    }
    emitMessage(result?.homeOwner, TaskNotifcationMessage.completed);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: result?.homeOwner,
          refference: result?._id,
          message: TaskNotifcationMessage.completed,
          type: "additional",
        },
      ],
      session
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const aprooveReschedule = async (id, payload) => {
  const findAdditionalTask = await AdditionalTask.findById(id);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(
      id,
      {
        $set: {
          date: findAdditionalTask?.preferableTime?.date,
          "preferableTime.date": null,
          "preferableTime.time": null,
        },
      },
      { new: true, session }
    );
  } catch (err) {}
};
const additionalTaskServices = {
  insertAdditionalTaskIntoDb,
  getAllAdditionlTask,
  getAllAdditionlTask,
  getAllAditionalTaskByEmployee,
  getSingleAdditionalTask,
  deleteAdditionalTask,
  markAsBusy,
  markAsComplete,
};
export default additionalTaskServices;
