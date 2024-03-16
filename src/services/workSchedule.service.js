import {
  isSameDay,
  isSameHour,
  isSameMinute,
  addMinutes,
  format,
} from "date-fns";

import QueryBuilder from "../builder/QueryBuilder.js";

import WorkSchedule from "../models/workSchedule.js";
import {
  getNextOccurrence,
  hasDateAndTimeConflict,
  hasRecurrenceConflict,
  hasTimeConflict,
} from "../utils/schedule.utils.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import Notification from "../models/notification.model.js";
import { emitMessage } from "../utils/socket.utils.js";

const insertUserTaskIntoDB = async (payload) => {
  const { employee, workingDays } = payload;
  const oldSchedule = await WorkSchedule.find({
    employee,
    workingDays: { $in: workingDays },
  }).select("startTime endTime");
  payload.assignedDate = new Date();
  const newSchedule = {
    startTime: payload?.startTime,
    endTime: payload?.endTime,
  };
  console.log(oldSchedule);
  // check same date same time conflict issue
  if (hasTimeConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "time conflict! Employee is already scheduled during this time."
    );
  }

  const result = await WorkSchedule.create(payload);
  return result;
};
const getAllTaskSchedule = async (query) => {
  const userTaskModel = new QueryBuilder(
    WorkSchedule.find({}).populate("groceries"),
    query
  )
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await userTaskModel.modelQuery;
  const meta = await userTaskModel.meta();
  return {
    meta,
    result,
  };
};
const getSingleTask = async (id) => {
  const result = await WorkSchedule.findById(id).populate(
    "employees room groceries homeOwner"
  );
  return result;
};
const reAssignTask = async (id, payload) => {
  const { employee, date, startTime, endTime, recurrence } = payload;
  if (!employee || !date || !startTime || !endTime || !recurrence) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Provide employee & date and time information"
    );
  }
  const oldSchedule = await WorkSchedule.find({
    employee,
  }).select("date startTime endTime recurrence");
  const newSchedule = {
    date: payload?.date,
    startTime: payload?.startTime,
    endTime: payload?.endTime,
    recurrence: payload?.recurrence,
  };
  // check same date same time conflict issue
  if (hasDateAndTimeConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "date and time conflict! Employee is already scheduled during this date and time."
    );
  }
  // // check same time and reccurence conflict issue
  if (hasRecurrenceConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "reccurence conflict! Employee is already scheduled during this time and reccurence."
    );
  }
  const result = await WorkSchedule.findByIdAndUpdate(
    id,
    {
      ...payload,
      nextOccurrence: new Date(`${payload?.date}T${payload?.startTime}`),
    },
    {
      new: true,
    }
  );
  return result;
};
const changeTaskStatus = async (id, payload) => {
  const result = await WorkSchedule.findByIdAndUpdate(
    id,
    {
      $set: {
        status: payload?.status,
        reason: payload?.reason,
        note: payload?.note,
      },
    },
    {
      new: true,
    }
  );
  return result;
};
const updateTask = async (id, payload) => {
  const result = await WorkSchedule.findByIdAndUpdate(
    id,
    {
      $set: {
        task: payload?.task,
        reminder: payload?.reminder,
      },
    },
    { new: true }
  );
  return result;
};

const deleteTask = async (id) => {
  const result = await WorkSchedule.findByIdAndDelete(id);
  return result;
};
const addGroceriesIntoTask = async (id, payload) => {
  const result = await WorkSchedule.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        groceries: { $each: payload?.groceries },
      },
    },
    { new: true }
  );
  return result;
};
const removeGroceriesFromTask = async (id, payload) => {
  const result = await WorkSchedule.findByIdAndUpdate(
    id,
    {
      $pull: {
        groceries: payload?.groceries,
      },
    },
    { new: true }
  );
  return result;
};
const sentReminder = async () => {
  // for bulk update
  const notifications = [];
  const date = new Date();
  const currentDate = addMinutes(date, 5);
  const formatedTime = format(currentDate, "HH:mm");
  const tasks = await WorkSchedule.aggregate([
    { $match: { startTime: formatedTime } },
    {
      $group: {
        _id: 1,
        employee: "$employee",
      },
    },
  ]);
  const uniqueEmployeeMessage = new Set();
  for (const task of tasks) {
    const handleNextOccurrence = getNextOccurrence(task);
    if (
      isSameDay(date, handleNextOccurrence) &&
      isSameHour(date, handleNextOccurrence) &&
      isSameMinute(date, handleNextOccurrence)
    ) {
      const notification = {
        receiver: task?.employee,
        refference: task?._id,
        message: "your task is arrived",
        type: "schedule",
      };
      notifications.push(notification);
    }
  }
  uniqueEmployeeMessage.forEach((message) => {
    emitMessage("schedule", message);
  });
  await Notification.insertMany(notifications);
  uniqueEmployeeMessage.clear();
};
// schedule.scheduleJob("*/25 * * * *", sentReminder);

// job();
const taskScheduleService = {
  insertUserTaskIntoDB,
  getAllTaskSchedule,
  getSingleTask,
  reAssignTask,
  addGroceriesIntoTask,
  removeGroceriesFromTask,
  changeTaskStatus,
  deleteTask,
  updateTask,
  sentReminder,
};
export default taskScheduleService;
