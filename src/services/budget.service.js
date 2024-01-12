import QueryBuilder from "../builder/QueryBuilder.js";
import Budget from "../models/budget.model.js";

const insertBudgetIntoDB = async (payload) => {
  const result = await Budget.create(payload);
  return result;
};

const getbudgetsByQuery = async (userId, payload) => {
  const query = userId ? { ...payload, user: userId } : { ...payload };
  const budgetModel = new QueryBuilder(Budget.find(), query)
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await budgetModel.modelQuery;
  const meta = await budgetModel.meta();
  return {
    meta,
    result,
  };
};
const getSingleBudget = async (id) => {
  const result = await Budget.findById(id);
  return result;
};

const updateBudget = async (id, userId, payload) => {
  const result = await Budget.findOneAndUpdate(
    { _id: id, user: userId },
    payload,
    {
      new: true,
    }
  );
  return result;
};

const deleteBudget = async (id, userId) => {
  const result = await Budget.findOneAndDelete({ _id: id, user: userId });
  return result;
};

const budgetServices = {
  insertBudgetIntoDB,
  getbudgetsByQuery,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
export default budgetServices;
