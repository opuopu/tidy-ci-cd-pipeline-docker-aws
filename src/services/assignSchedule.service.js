import { Types } from "mongoose";
import { SundayToThursday } from "../constant/workingDays.js";
import AssignSchedule from "../models/AssignWorkSchedule.model.js";
import AppError from "../errors/AppError.js";
import httpStatus from "http-status";
const insertScheduleIntoDb = async (payload) => {
  const findSchedule = await AssignSchedule.findOne({
    employee: payload?.employee,
    workingDays: {
      $in: payload?.workingDays,
    },
  });
  if (findSchedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "day conflict. employee has already assigned during this days"
    );
  }
  const result = await AssignSchedule.create(payload);
  return result;
};
const getAllAssignSchedule = async (query) => {
  const result = await AssignSchedule.find(query);
  return result;
};
const getAssignedSchedule = async (id) => {
  const result = await AssignSchedule.findById(id);
  return result;
};
const updateAssignSchedule = async (id, payload) => {
  const findSchedule = await AssignSchedule.find({
    _id: { $ne: id },
    employee: payload?.employee,
    workingDays: {
      $in: payload?.workingDays,
    },
  });
  if (findSchedule?.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "day conflict. employee has already assigned during this days"
    );
  }
  const result = await AssignSchedule.findByIdAndUpdate(id, payload);
  return result;
};

const getDataFromSundayToThursday = async (userId) => {
  const userObjectId = new Types.ObjectId(userId);
  const result = await AssignSchedule.aggregate([
    {
      $match: {
        homeOwner: userObjectId,
        workingDays: {
          $in: SundayToThursday,
        },
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $lookup: {
        from: "workschedules",
        localField: "_id",
        foreignField: "schedule",
        as: "schedules",
      },
    },
    {
      $project: {
        _id: "$_id",
        employee: "$employee",
        schedules: "$schedules",
      },
    },
  ]);

  return result;
};
const getSaturdayData = async (userId) => {
  const userObjectId = new Types.ObjectId(userId);
  const result = await AssignSchedule.aggregate([
    {
      $match: {
        homeOwner: userObjectId,
        workingDays: {
          $in: ["Sat"],
        },
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $lookup: {
        from: "workschedules",
        localField: "_id",
        foreignField: "schedule",
        as: "schedules",
      },
    },
    {
      $project: {
        _id: "$_id",
        employee: "$employee",
        schedules: "$schedules",
      },
    },
  ]);

  return result;
};

const getWeekendData = async (userId) => {
  const result = await AssignSchedule.find({ homeOwner: userId })
    .populate({
      path: "employee",
      select: "name",
    })
    .select("weekend employee");
  return result;
};

const employeeWorkDetailsByScheduleId = async (id) => {
  const ScheduleId = new Types.ObjectId(id);
  const result = await AssignSchedule.aggregate([
    {
      $match: {
        _id: ScheduleId,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $lookup: {
        from: "workschedules",
        localField: "_id",
        foreignField: "schedule",
        as: "schedules",
      },
    },
  ]);
  console.log(result);
  return result;
};
const getScheduleDataByEmployee = async (id) => {
  const employeeId = new Types.ObjectId(id);
  console.log(employeeId);
  const result = await AssignSchedule.aggregate([
    {
      $match: {
        employee: employeeId,
      },
    },
    // {
    //   $lookup: {
    //     from: "employees",
    //     localField: "employee",
    //     foreignField: "_id",
    //     as: "employee",
    //   },
    // },
    // {
    //   $unwind: "$employee",
    // },
    {
      $lookup: {
        from: "workschedules",
        localField: "_id",
        foreignField: "schedule",
        as: "schedules",
      },
    },
  ]);
  return result;
};

const AssignScheduleServices = {
  insertScheduleIntoDb,
  getAllAssignSchedule,
  getAssignedSchedule,
  updateAssignSchedule,
  getDataFromSundayToThursday,
  getWeekendData,
  getSaturdayData,
  getScheduleDataByEmployee,
  employeeWorkDetailsByScheduleId,
};
export default AssignScheduleServices;
