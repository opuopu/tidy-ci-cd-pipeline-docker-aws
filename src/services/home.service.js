import QueryBuilder from "../builder/QueryBuilder.js";
import Home from "../models/home.model.js";

const inserHomeIntoDB = async (payload) => {
  const result = await Home.create(payload);
  return result;
};
const getAllHomes = async (query) => {
  const homequery = new QueryBuilder(Home.find().populate("user"), query)
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await homequery.modelQuery;
  const meta = await homequery.meta();
  return {
    meta,
    result,
  };
};

const getSingleHome = async (id) => {
  const result = await Home.findOne({ _id: id }).populate("user");
  return result;
};
const updateHome = async (id, payload) => {
  const result = await Home.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("user");
  return result;
};
const deleteHome = async (id) => {
  const result = await Home.findByIdAndDelete(id);
  return result;
};

const homeServices = {
  inserHomeIntoDB,
  getAllHomes,
  getSingleHome,
  updateHome,
  deleteHome,
};

export default homeServices;
