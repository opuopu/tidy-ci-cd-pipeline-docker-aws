import { io } from "../server.js";

export const emitMessage = (key, message) => {
  io.emit(key, message);
};
