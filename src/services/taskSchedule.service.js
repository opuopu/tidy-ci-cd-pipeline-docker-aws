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
  const { employees } = payload;

  const oldSchedule = await TaskSchedule.find({
    employees: {
      $in: employees,
    },
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
const getAllUserTaskByQuery = async (query) => {
  const userTaskModel = new QueryBuilder(TaskSchedule.find(), query)
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
  const result = await TaskSchedule.findById(id);
  return result;
};

const deleteTask = async (id) => {
  const result = await TaskSchedule.findByIdAndDelete(id);
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
  getAllUserTaskByQuery,
  getSingleTask,
  deleteTask,
};
export default taskScheduleService;
