import { User } from "../models/user.model.js";

const findLastEmployeeId = async () => {
  const lastId = await User.findOne({ role: "employee" })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastId?.id ? lastId?.id : undefined;
};

export const generateNewEmployeeId = async () => {
  let currentId = (0).toString();
  const lastEmployee = await findLastEmployeeId();
  if (lastEmployee) {
    currentId = lastEmployee.substring(9);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `employee-${incrementId}`;
  return incrementId;
};
