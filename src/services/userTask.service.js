import QueryBuilder from "../builder/QueryBuilder.js";
import userTasks from "../models/userTask.model.js";

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

const jobs = () => {};
