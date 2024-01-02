import HomeCategory from "../models/homeCategory.model.js";

const insertHomeCateogryIntoDB = async (payload) => {
  const result = await HomeCategory.create(payload);
  return result;
};

const getAllHomeCategories = async () => {
  const result = await HomeCategory.find();
  return result;
};

const getSingleHomeCategory = async (id) => {
  const result = await HomeCategory.findOne({ _id: id });
  return result;
};

const homeCategoryServices = {
  insertHomeCateogryIntoDB,
  getAllHomeCategories,
  getSingleHomeCategory,
};
export default homeCategoryServices;
