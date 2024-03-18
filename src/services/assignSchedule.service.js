import { Types } from "mongoose";
import {
  SundayToThursday,
  defaultTimeRanges,
} from "../constant/workingDays.js";
import AssignSchedule from "../models/AssignWorkSchedule.model.js";
const insertScheduleIntoDb = async (payload) => {
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
      $group: {
        _id: {
          employeeId: "$employee._id",
          name: "$employee.name",
        },
        schedules: { $push: { $arrayElemAt: ["$schedules", 0] } },
      },
    },
    {
      $project: {
        _id: "$_id.employeeId",
        name: "$_id.name",
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
      $group: {
        _id: {
          employeeId: "$employee._id",
          name: "$employee.name",
        },
        schedules: { $push: { $arrayElemAt: ["$schedules", 0] } },
      },
    },
    {
      $project: {
        _id: "$_id.employeeId",
        name: "$_id.name",
        workingDays: "$workingDays",
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

const AssignScheduleServices = {
  insertScheduleIntoDb,
  getAllAssignSchedule,
  getAssignedSchedule,
  updateAssignSchedule,
  getDataFromSundayToThursday,
  getWeekendData,
  getSaturdayData,
};
export default AssignScheduleServices;
