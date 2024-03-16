import AssignSchedule from "../models/AssignWorkSchedule.model.js";

const insertScheduleIntoDb = async (payload) => {
  const result = await AssignSchedule.create(payload);
  return result;
};

const getAssignedSchedule = async (employeeId) => {
  const result = await AssignSchedule.findOne(employeeId);
  return result;
};
const updateAssignSchedule = async (id) => {
  const result = await AssignSchedule.findByIdAndUpdate(id);
  return result;
};
const AssignScheduleServices = {
  insertScheduleIntoDb,
  getAssignedSchedule,
  updateAssignSchedule,
};
export default AssignScheduleServices;
