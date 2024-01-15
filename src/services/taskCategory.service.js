import TaskCategory from "../models/taskCategory.model.js";

const insertTaskCategoryIntoDB = async (payload) => {
  const result = await TaskCategory.create(payload);
  return result;
};

const getAllTaskCategoires = async (payload) => {
  const result = await TaskCategory.find({});
  return result;
};

const getsingleTaskCategory = async (id) => {
  const result = await TaskCategory.findById(id);
  return result;
};

const taskCategoryServices = {
  insertTaskCategoryIntoDB,
  getAllTaskCategoires,
  getsingleTaskCategory,
};
export default taskCategoryServices;
