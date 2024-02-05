import QueryBuilder from "../builder/QueryBuilder.js";
import TaskList from "../models/taskList.model.js";

const insertTaskIntoDB = async (payload) => {
  const result = await TaskList.create(payload);
  return result;
};

// filter tasks by task category id
const getAllTasks = async (query) => {
  const taskListModel = new QueryBuilder(
    TaskList.find().populate("category"),
    query
  )
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await taskListModel.modelQuery;
  const meta = await taskListModel.meta();
  return {
    meta,
    result,
  };
};
const getSingleTask = async (id) => {
  const result = await TaskList.findById(id).populate("category");
  return result;
};

const taskListServices = {
  insertTaskIntoDB,
  getAllTasks,
  getSingleTask,
};

export default taskListServices;
