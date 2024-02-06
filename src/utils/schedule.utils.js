import { addDays, addMonths, addWeeks, nextDay, parseISO } from "date-fns";

export const hasDateAndTimeConflict = (assignSchedules, newSchedules) => {
  console.log("goignh", assignSchedules, newSchedules);
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
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    if (newSchedule?.recurrence === "daily") {
      if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
        return true;
      }
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
  console.log(time);
  const combinedDateTimeString = `${date}T${time}:00`;
  return addDays(new Date(combinedDateTimeString), 1);
};
export const nextWeekDateAndTime = (date, time) => {
  const combinedDateTimeString = `${date}T${time}:00`;
  return addWeeks(parseISO(combinedDateTimeString), 1);
};
export const nextMonthDateAndTime = (date, time) => {
  const combinedDateTimeString = `${date}T${time}:00`;
  return addMonths(combinedDateTimeString, 1);
};

// Sat | Sun  | Mon | Tue | Wed | Tue | Wed |Thu | Fri
