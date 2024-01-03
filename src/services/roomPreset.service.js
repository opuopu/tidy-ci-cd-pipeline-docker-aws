import RoomPreset from "../models/roomPreset.model.js";

const createRoomPresetIntoDB = async (payload) => {
  const result = await RoomPreset.create(payload);
  return result;
};
const getAllRoomPresets = async (payload) => {
  const result = await RoomPreset.find({});
  return result;
};
const getsingRoompreset = async (id) => {
  const result = await RoomPreset.findById(id);
  return result;
};

const roomPresetServices = {
  createRoomPresetIntoDB,
  getAllRoomPresets,
  getsingRoompreset,
};
export default roomPresetServices;
