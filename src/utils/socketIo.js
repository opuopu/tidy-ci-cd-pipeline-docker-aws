// socketIO.js
import { Server } from "socket.io";
const initializeSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log(`ID: ${socket.id} disconnected`);
    });
    // Additional Socket.IO event handlers can be added here
  });
  return io;
};

export default initializeSocketIO;
