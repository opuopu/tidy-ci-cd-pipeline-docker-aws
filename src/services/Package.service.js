import Packages from "../models/packages.model.js";

const insertPackageIntoDB = async (payload) => {
  const result = await Packages.create(payload);
  return result;
};

const getAllPackages = async () => {
  const result = await Packages.find({});
  return result;
};
const getSinglePackage = async (id) => {
  const result = await Packages.findById(id);
  return result;
};

const packageServices = {
  insertPackageIntoDB,
  getAllPackages,
  getSinglePackage,
};
export default packageServices;
