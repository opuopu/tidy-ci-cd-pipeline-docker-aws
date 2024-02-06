import {
  isSameDay,
  isSameHour,
  isSameMinute,
  addMinutes,
  format,
} from "date-fns";

import QueryBuilder from "../builder/QueryBuilder.js";

import TaskSchedule from "../models/taskSchedule.model.js";
import {
  getNextOccurrence,
  hasDateAndTimeConflict,
  hasRecurrenceConflict,
} from "../utils/schedule.utils.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import Notification from "../models/notification.model.js";
import { emitMessage } from "../utils/socket.utils.js";
import schedule from "node-schedule";
const insertUserTaskIntoDB = async (payload) => {
  const { employee } = payload;
  const oldSchedule = await TaskSchedule.find({
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
    console.log("clicked");
    throw new AppError(
      httpStatus.CONFLICT,
      "date and time conflict! Employee is already scheduled during this date and time."
    );
  }
  // check same time and reccurence conflict issue
  if (hasRecurrenceConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "reccurence conflict! Employee is already scheduled during this time and reccurence."
    );
  }
  // check only time conflict issue
  const result = await TaskSchedule.create({
    ...payload,
    nextOccurrence: new Date(`${payload?.date}T${payload?.startTime}`),
  });
  return result;
};
const getAllTaskSchedule = async (query) => {
  const userTaskModel = new QueryBuilder(
    TaskSchedule.find({}).populate("groceries"),
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
  const result = await TaskSchedule.findById(id).populate(
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
  const oldSchedule = await TaskSchedule.find({
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
  const result = await TaskSchedule.findByIdAndUpdate(
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
  const result = await TaskSchedule.findByIdAndUpdate(
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
  const result = await TaskSchedule.findByIdAndUpdate(
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
  const result = await TaskSchedule.findByIdAndDelete(id);
  return result;
};
const addGroceriesIntoTask = async (id, payload) => {
  const result = await TaskSchedule.findByIdAndUpdate(
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
  const result = await TaskSchedule.findByIdAndUpdate(
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
  const date = new Date();
  const currentDate = addMinutes(date, 5);
  const formatedTime = format(currentDate, "HH:mm");
  const tasks = await TaskSchedule.aggregate([
    { $match: { startTime: formatedTime } },
    {
      $group: {
        _id: "$employee",
      },
    },
  ]);
  console.log(tasks);
  const uniqueEmployeeMessage = new Set();
  for (const task of tasks) {
    const handleNextOccurrence = getNextOccurrence(task);
    if (
      isSameDay(date, handleNextOccurrence) &&
      isSameHour(date, handleNextOccurrence) &&
      isSameMinute(date, handleNextOccurrence)
    ) {
      const notification = await Notification.create({
        receiver: task?.employee,
        message: "your task is arrived",
        type: "schedule",
      });
      if (notification) {
        uniqueEmployeeMessage.add(notification?.message);
      }
    }
  }
  uniqueEmployeeMessage.forEach((message) => {
    emitMessage("schedule", message);
  });
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
