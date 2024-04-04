import WorkSchedule from "../models/workSchedule.js";
import { hasTimeConflict } from "../utils/schedule.utils.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
import AssignSchedule from "../models/AssignWorkSchedule.model.js";

import { TaskNotifcationMessage } from "../constant/notificationMessae.js";
import notificationServices from "./notification.service.js";
import QueryBuilder from "../builder/QueryBuilder.js";

const insertUserTaskIntoDB = async (payload) => {
  const { schedule } = payload;
  const findSchedule = await AssignSchedule.findById(schedule);
  if (!findSchedule) {
    throw new AppError(httpStatus.BAD_REQUEST, "Schedule Not Found");
  }
  const oldSchedule = await WorkSchedule.find({
    schedule,
  });

  const newSchedule = {
    startTime: payload?.startTime,
    endTime: payload?.endTime,
  };
  // check same date same time conflict issue
  if (hasTimeConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "time conflict! Employee is already scheduled during this days and time."
    );
  }

  const result = await WorkSchedule.create(payload);
  return result;
};
const insertBreakTimeIntoDb = async (payload) => {
  const { schedule } = payload;

  const findSchedule = await AssignSchedule.findById(schedule);
  if (!findSchedule) {
    throw new AppError(httpStatus.BAD_REQUEST, "Schedule Not Found");
  }
  const oldSchedule = await WorkSchedule.find({
    schedule,
  });

  const newSchedule = {
    startTime: payload?.startTime,
    endTime: payload?.endTime,
  };
  // check same date same time conflict issue
  if (hasTimeConflict(oldSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Employee is already on a break or scheduled during this days and time"
    );
  }

  const result = await WorkSchedule.create({
    ...payload,
    task: "Break Time",
    type: "break",
  });
  return result;
};
const getAllWorkSchedule = async (query) => {
  if (!query?.schedule) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "please provide schedule information "
    );
  }
  const result = await WorkSchedule.find(query);
  return result;
};

const getAllWorkScheduleByRoom = async (query) => {
  const workScheduleModel = new QueryBuilder(
    WorkSchedule.find().populate({
      path: "schedule",
      populate: {
        path: "employee",
      },
    }),
    query
  );
  const result = await workScheduleModel.modelQuery;
  const meta = await workScheduleModel.meta();
  return {
    result,
    meta,
  };
};
const getsingleWorkSchedule = async (id) => {
  const result = await WorkSchedule.findById(id);
  return result;
};
const finishSchedule = async (payload) => {
  const { schedule } = payload;
  const findSchedule = await AssignSchedule.findById(schedule);
  if (!findSchedule) {
    throw new AppError(httpStatus.NOT_FOUND, "schedule information not found");
  }

  const result = await notificationServices.insertNotificationIntoDBv2({
    receiver: findSchedule?.employee,
    refference: schedule,
    message: TaskNotifcationMessage.daily,
    type: "work",
  });
  return result;
};
const updateSchedule = async (id, payload) => {
  const { startTime, endTime } = payload || {};
  const getSingleSchedule = await WorkSchedule.findById(id);
  if (!getSingleSchedule) {
    throw new AppError(httpStatus.NOT_FOUND, "work schedule not found");
  }
  const findAllSchedules = await WorkSchedule.find({
    schedule: getSingleSchedule?.schedule,
  });

  if (
    startTime !== getSingleSchedule?.startTime &&
    endTime !== getSingleSchedule?.endTime
  ) {
    if (hasTimeConflict(findAllSchedules, { startTime, endTime })) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "time conflict! Employee is already scheduled during this days and time."
      );
    }
  }

  const result = await WorkSchedule.findByIdAndUpdate(id, payload);
  return result;
};
const deleteSingleSchedule = async (id) => {
  const result = await WorkSchedule.findByIdAndDelete(id);
  return result;
};

const taskScheduleService = {
  insertUserTaskIntoDB,
  insertBreakTimeIntoDb,
  getAllWorkSchedule,
  getsingleWorkSchedule,
  finishSchedule,
  updateSchedule,
  deleteSingleSchedule,
  getAllWorkScheduleByRoom,
};
export default taskScheduleService;
