import dayjs from "dayjs";

export const dateCompare = (oldDate, newDate) => {
  return dayjs(oldDate).isBefore(dayjs(newDate));
};
export const nextFiveDay = (date) => {
  return dayjs(date).add(5, "day").toDate();
};
export const calculateRemainingDays = (startDate, endDate) => {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");
  const diffInDays = end.diff(start, "day");
  return diffInDays;
};
