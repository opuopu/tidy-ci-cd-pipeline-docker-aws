import {
  addDays,
  addWeeks,
  addMonths,
  isAfter,
  parseISO,
  set,
  parse,
  isSameDay,
  isSameHour,
  isSameMinute,
} from "date-fns";
import { isEqual } from "date-fns";
import QueryBuilder from "../builder/QueryBuilder.js";

import { scheduleJob } from "node-schedule";
import TaskSchedule from "../models/taskSchedule.model.js";
import {
  hasDateAndTimeConflict,
  hasRecurrenceConflict,
  hasTimeConflict,
} from "../utils/schedule.utils.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
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

  const result = await TaskSchedule.create(payload);
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
  const { employee, date, startTime, endTime } = payload;
  if (!employee || !date || !startTime || !endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Provide employee & date and time information"
    );
  }
  const oldSchedule = await TaskSchedule.find({
    employee,
  }).select("date startTime endTime recurrence");
  console.log(oldSchedule);
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

  // check same time and reccurence conflict issue
  if (hasRecurrenceConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "reccurence conflict! Employee is already scheduled during this time and reccurence."
    );
  }
  const result = await TaskSchedule.findByIdAndUpdate(id, payload, {
    new: true,
  });
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
  console.log("clicked");
  const tasks = await TaskSchedule.find({});
  const currentDate = new Date();
  console.log("currentDate", currentDate);
  for (const task of tasks) {
    console.log(task);
    if (
      isSameDay(currentDate, task?.nextOccurrence) &&
      isSameHour(currentDate, task?.nextOccurrence) &&
      isSameMinute(currentDate, task?.nextOccurrence)
    ) {
      console.log("corn jobs is working. thank you ");
      // here i use socket io for push notification
      // update nextoccurrence field into database
    }
  }
};

//  scheduleJob("*/1 8-22 * * *", sentReminder);
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
};
export default taskScheduleService;
