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
import userTasks from "../models/userTask.model.js";
import { scheduleJob } from "node-schedule";

const insertUserTaskIntoDB = async (paylaod) => {
  const result = await userTasks.create(paylaod);
  return result;
};
const getAllUserTaskByQuery = async (query) => {
  const userTaskModel = new QueryBuilder(userTasks.find(), query)
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
  const result = await userTasks.findById(id);
  return result;
};

const deleteTask = async (id) => {
  const result = await userTasks.findByIdAndDelete(id);
  return result;
};

const sentReminder = async () => {
  console.log("clicked");
  const tasks = await userTasks.find({});
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
    }
  }
};

const job = scheduleJob("*/1 8-22 * * *", sentReminder);
// job();
const userTaskServices = {
  insertUserTaskIntoDB,
  getAllUserTaskByQuery,
  getSingleTask,
  deleteTask,
};
export default userTaskServices;
