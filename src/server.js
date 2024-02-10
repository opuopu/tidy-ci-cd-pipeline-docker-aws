import mongoose from "mongoose";
import app from "./app.js";
import { createServer } from "http";
import infoLogger from "./Logger/infoLogger.js";
import errorLoger from "./Logger/errorLoger.js";
import config from "./config/index.js";
import initializeSocketIO from "./socketIo.js";
const server = createServer(app);
export const io = initializeSocketIO(server);
async function main() {
  try {
    await mongoose.connect(config.database_url);

    app.listen(config.port, config.ip, () => {
      console.log(`app is listening on port ${config.port}`);
      infoLogger.info(
        `Server is running at http://${config.ip}:${config.port}`
      );
    });
    server.listen(config.socket_port, config.ip, () => {
      console.log(`socker server listening on port ${config?.socket_port}`);
    });
  } catch (error) {
    console.log(error);
    errorLoger.error(error);
  }
}
main();
process.on("unhandledRejection", (err) => {
  console.log(`😈 server is closed by unhandledRejection error `, err);
  errorLoger.error(`😈 server is closed by unhandledRejection error `);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(`😈 server is closed by uncaughtException error,`);
  errorLoger.error(`😈 server is closed by uncaughtException error,`);
  process.exit(1);
});
