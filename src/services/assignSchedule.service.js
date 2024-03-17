import AssignSchedule from "../models/AssignWorkSchedule.model.js";
const insertScheduleIntoDb = async (payload) => {
  const result = await AssignSchedule.create(payload);
  return result;
};
const getAllAssignSchedule = async (query) => {
  const result = await AssignSchedule.find(query);
  return result;
};
const getAssignedSchedule = async (id) => {
  const result = await AssignSchedule.findById(id);
  return result;
};
const updateAssignSchedule = async (id, payload) => {
  const result = await AssignSchedule.findByIdAndUpdate(id, payload);
  return result;
};
const AssignScheduleServices = {
  insertScheduleIntoDb,
  getAllAssignSchedule,
  getAssignedSchedule,
  updateAssignSchedule,
};
export default AssignScheduleServices;
