import budgetCategory from "../models/budgetCategory.model.js";

const insertBudgetCategoryIntoDb = async (payload) => {
  const result = await budgetCategory.create(payload);
  return result;
};

const getallFromDb = async () => {
  const result = await budgetCategory.find({});
  return result;
};

const getSingleFromDb = async (id) => {
  const result = await budgetCategory.findById(id);
  return result;
};

const budgetCategoryServices = {
  insertBudgetCategoryIntoDb,
  getallFromDb,
  getSingleFromDb,
};
export default budgetCategoryServices;
