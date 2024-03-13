import dayjs from "dayjs";

export const dateCompare = (oldDate, newDate) => {
  return dayjs(oldDate).isBefore(dayjs(newDate));
};
