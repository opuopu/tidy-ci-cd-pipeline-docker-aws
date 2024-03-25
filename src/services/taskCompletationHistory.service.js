import QueryBuilder from "../builder/QueryBuilder.js";
import TaskCompletationHistory from "../models/taskCompleteHistory.model.js";

const getAllHistoryByTaskId = async (query) => {
  const historyModel = new QueryBuilder(TaskCompletationHistory.find(), query)
    .search()
    .filter()
    .paginate()
    .fields()
    .sort();
  const result = await historyModel.modelQuery;
  const meta = await historyModel.meta();
  return {
    result,
    meta,
  };
};
const deleteAllHistory = async (id) => {
  const result = await TaskCompletationHistory.deleteMany({ task: id });
  return result;
};

const completeHistoryServices = {
  getAllHistoryByTaskId,
  deleteAllHistory,
};
export default completeHistoryServices;
