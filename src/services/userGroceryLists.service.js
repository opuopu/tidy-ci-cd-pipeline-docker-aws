import httpStatus from "http-status";
import QueryBuilder from "../builder/QueryBuilder.js";
import AppError from "../errors/AppError.js";
import UserGroceryList from "../models/userGroceryList.model.js";
import { emitMessage } from "../utils/socket.utils.js";
import mongoose from "mongoose";
import notificationServices from "./notification.service.js";
import { TaskNotifcationMessage } from "../constant/notificationMessae.js";
import Employee from "../models/employee.model.js";
const insertUserGroceryListsIntoDB = async (payload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await UserGroceryList.create(payload);
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to assign task");
    }
    emitMessage(payload?.employee, TaskNotifcationMessage.grocery);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: payload.employee,
          refference: result?._id,
          message: TaskNotifcationMessage.grocery,
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

const findGroceryFromGroceryLists = async (query) => {
  console.log(query);
  const goceryListModel = new QueryBuilder(UserGroceryList.find(), query)
    .search(["name"])
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await goceryListModel.modelQuery;
  return result;
};

const getgroceryListByEmployee = async (query) => {
  const UserListModel = new QueryBuilder(UserGroceryList.find(), query)
    .search()
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await UserListModel.modelQuery;
  const meta = await UserListModel.meta();
  return {
    meta,
    result,
  };
};
const getuserSingleGroceryList = async (id) => {
  const result = await UserGroceryList.findById(id).populate("homeOwner");

  return result;
};

const updateUserGroceryList = async (id, payload) => {
  const findUserGroceryLists = await UserGroceryList.findById(id);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await UserGroceryList.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to update task");
    }
    if (
      payload?.employee &&
      payload?.employee !== findUserGroceryLists?.employee
    ) {
      emitMessage(payload?.employee, TaskNotifcationMessage.grocery);
      await notificationServices.insertNotificationIntoDB(
        [
          {
            receiver: payload.employee,
            refference: result?._id,
            message: TaskNotifcationMessage.grocery,
            type: "task",
          },
        ],
        session
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const deleteGroceryFromList = async (id) => {
  const result = await UserGroceryList.findByIdAndDelete(id);
  return result;
};
const markAsBusy = async (id, payload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await UserGroceryList.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "busy",
          note: payload?.note,
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
    emitMessage(payload?.homeOwner, TaskNotifcationMessage.busy);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: payload?.homeOwner,
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
    const result = await UserGroceryList.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "completed",
          note: payload?.note,
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
    emitMessage(payload?.homeOwner, TaskNotifcationMessage.completed);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: payload?.homeOwner,
          refference: result?._id,
          message: TaskNotifcationMessage.completed,
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
const userGroceryListServices = {
  insertUserGroceryListsIntoDB,
  findGroceryFromGroceryLists,
  getgroceryListByEmployee,
  getuserSingleGroceryList,
  updateUserGroceryList,
  deleteGroceryFromList,
  markAsBusy,
  markAsComplete,
};
export default userGroceryListServices;
