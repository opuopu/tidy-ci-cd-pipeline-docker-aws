import QueryBuilder from "../builder/QueryBuilder.js";
import Notification from "../models/notification.model.js";
const insertNotificationIntoDB = async (payload) => {
  const result = await Notification.create(payload);
  return result;
};
const getUserSpecificNotifications = async (userId) => {
  const query = {};
  if (userId) query["receiver"] = userId;
  const notificationQuery = new QueryBuilder(Notification.find({}), query)
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.meta();

  return {
    result,
    meta,
  };
};

const deleteNotification = async (id) => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

const notificationServices = {
  insertNotificationIntoDB,
  getUserSpecificNotifications,
  deleteNotification,
};
export default notificationServices;
