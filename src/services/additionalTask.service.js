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
import { dateCompare } from "../utils/date.utils.js";
const insertAdditionalTaskIntoDb = async (payload) => {
  const { workingDate } = payload;
  let status;
  let nextOccurrence;
  if (payload.recurrence === "weekly") {
    status = "ongoing";
    nextOccurrence = nextWeekDay(workingDate);
  } else if (payload.recurrence === "monthly") {
    status = "ongoing";
    nextOccurrence = nextMonth(workingDate);
  }
  console.log(nextOccurrence);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.create({
      ...payload,
      nextOccurrence: nextOccurrence,
      status: status,
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
  const findTask = await AdditionalTask.findById(id);
  // check the reccurene conflict
  if (
    findTask.recurrence !== "onetime" &&
    dateCompare(findTask?.nextOccurrence, payload?.preferableDate)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "please select your preferableDate date before next nextOccurrence date"
    );
  }
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "busy",
          note: payload?.note,
          preferableDate: payload?.preferableDate,
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
const markAsComplete = async (id, payload) => {
  const session = await mongoose.startSession();
  const findTask = await AdditionalTask.findById(id);
  if (findTask?.status === "busy") {
    throw new AppError(httpStatus.BAD_REQUEST, "this task under in busy");
  }
  if (findTask?.recurrence === "weekly") {
    payload.workingDate = findTask.nextOccurrence;
    payload.nextOccurrence = nextWeekDay(findTask?.nextOccurrence);
  } else if (findTask?.recurrence === "monthly") {
    payload.workingDate = findTask.nextOccurrence;
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
    if (findTask?.recurrence !== "onetime") {
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
const AprooveReschedule = async (id) => {
  const findAdditionalTask = await AdditionalTask.findById(id);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(
      id,
      {
        $set: {
          workingDate: findAdditionalTask?.preferableDate,
          status: "ongoing",
          preferableDate: null,
        },
      },
      { new: true, session }
    );
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "failed to approve. Please try again"
      );
    }
    emitMessage(result?.homeOwner, TaskNotifcationMessage.approved);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: result?.employee,
          refference: result?._id,
          message: TaskNotifcationMessage.approved,
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
  }
};

const AssignToothers = async (payload) => {
  const session = await mongoose.startSession();
  payload.status = "pending";
  payload.recurrence = "onetime";
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
// re asign the full task to others employee by home owner
const UpdateAdditionalTask = async (id, payload) => {
  if (payload?.recurrence === "weekly") {
    payload.status = "ongoing";
    payload.nextOccurrence = nextWeekDay(payload?.workingDate);
  } else if (payload?.recurrence === "monthly") {
    payload.status = "ongoing";
    payload.nextOccurrence = nextMonth(payload?.workingDate);
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await AdditionalTask.findByIdAndUpdate(id, payload, {
      new: true,
      session,
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

const additionalTaskServices = {
  insertAdditionalTaskIntoDb,
  getAllAdditionlTask,
  getAllAdditionlTask,
  getAllAditionalTaskByEmployee,
  getSingleAdditionalTask,
  deleteAdditionalTask,
  markAsBusy,
  markAsComplete,
  AprooveReschedule,
  AssignToothers,
  UpdateAdditionalTask,
};
export default additionalTaskServices;
