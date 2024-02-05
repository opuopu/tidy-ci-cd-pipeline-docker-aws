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

// Sat | Sun  | Mon | Tue | Wed | Tue | Wed |Thu | Fri
