import httpStatus from "http-status";
import { TaskNotifcationMessage } from "../constant/notificationMessae.js";
import AdditionalTask from "../models/additionalTask.model.js";
import mongoose from "mongoose";
import { emitMessage } from "../utils/socket.utils.js";
import { nextMonth, nextWeekDay } from "../utils/schedule.utils.js";
import notificationServices from "./notification.service.js";
import QueryBuilder from "../builder/QueryBuilder.js";
const insertAdditionalTaskIntoDb = async (payload) => {
  const { date } = payload;
  if (payload.recurrence === "weekly") {
    payload.nextOccurrence = nextWeekDay(date);
  } else if (payload.recurrence === "monthly") {
    payload.nextOccurrence = nextMonth(date);
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.create(payload);
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
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            status: "completed",
            nextOccurrence: {
              $cond: {
                if: { $eq: ["$recurrence", "weekly"] },
                then: nextWeekDay("$nextOccurrence"),
                else: {
                  $cond: {
                    if: { $eq: ["$recurrence", "monthly"] },
                    then: nextMonth("$nextOccurrence"),
                    else: null,
                  },
                },
              },
            },
          },
        },
      ],
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
