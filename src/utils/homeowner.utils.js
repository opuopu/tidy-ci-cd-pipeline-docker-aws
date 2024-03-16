import { User } from "../models/user.model.js";

const findLastHomeOwnerId = async () => {
  const lastId = await User.findOne({ role: "homeowner" })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastId?.id ? lastId?.id : undefined;
};

export const generateNewHomeOwnerId = async () => {
  let currentId = (0).toString();
  const lastHomeOwner = await findLastHomeOwnerId();
  if (lastHomeOwner) {
    currentId = lastHomeOwner.substring(10);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `homeowner-${incrementId}`;
  return incrementId;
};
