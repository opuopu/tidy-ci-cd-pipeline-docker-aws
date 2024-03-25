import { addDays, addMonths, addWeeks, nextDay, parseISO } from "date-fns";
import dayjs from "dayjs";

export const hasDateAndTimeConflict = (assignSchedules, newSchedules) => {
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(
      `${schedule.date}T${schedule.startTime}`
    );
    const existingEndTime = new Date(`${schedule.date}T${schedule.endTime}`);
    const newStartTime = new Date(
      `${newSchedules.date}T${newSchedules.startTime}`
    );
    const newEndTime = new Date(`${newSchedules.date}T${newSchedules.endTime}`);
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
export const hasTimeConflict = (assignSchedules, newSchedule) => {
  console.log(assignSchedules, newSchedule);
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};

export const hasRecurrenceConflict = (assignSchedules, newSchedule) => {
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    if (
      schedule?.recurrence === newSchedule?.recurrence &&
      newStartTime < existingEndTime &&
      newEndTime > existingStartTime
    ) {
      return true;
    }
  }
  return false;
};

export const nextDayAndTime = (date, time) => {
  const combinedDateTimeString = new Date(`${date}T${time}`);
  return addDays(combinedDateTimeString, 1);
};
export const nextWeekDateAndTime = (date, time) => {
  const combinedDateTimeString = new Date(`${date}T${time}`);
  return addWeeks(combinedDateTimeString, 1);
};
export const nextMonthDateAndTime = (date, time) => {
  const combinedDateTimeString = new Date(`${date}T${time}`);
  return addMonths(combinedDateTimeString, 1);
};

export const getNextOccurrence = (task) => {
  switch (task?.recurrence) {
    case "monthly":
      return nextMonthDateAndTime(task?.date, task?.startTime);
    case "weekly":
      return nextWeekDateAndTime(task?.date, task?.startTime);
    case "daily":
      return nextDayAndTime(task?.date, task?.startTime);
    default:
      // Handle other recurrence types if needed
      return null;
  }
};

// Sat | Sun  | Mon | Tue | Wed | Tue | Wed |Thu | Fri
export const nextWeekDay = (date) => {
  return dayjs(date).add(7, "day").toDate();
};
export const nextMonth = (date) => {
  return dayjs(date).add(1, "month").toDate();
};
export const nextYear = (date) => {
  return dayjs(date).add(1, "year").toDate();
};

export const findArrayIntersection = (workingdays, weekend) => {
  return workingdays.filter((item) => weekend.includes(item));
};
