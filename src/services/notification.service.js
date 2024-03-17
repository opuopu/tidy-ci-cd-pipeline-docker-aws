import QueryBuilder from "../builder/QueryBuilder.js";
import Notification from "../models/notification.model.js";
const insertNotificationIntoDB = async (payload, session) => {
  const result = await Notification.create(payload, { session });
  return result;
};
const insertNotificationIntoDBv2 = async (payload) => {
  const result = await Notification.create(payload);
  return result;
};
const getUserSpecificNotifications = async (query) => {
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
  insertNotificationIntoDBv2,
  deleteNotification,
};
export default notificationServices;
