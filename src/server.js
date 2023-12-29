import mongoose from "mongoose";
import app from "./app.js";

import infoLogger from "./Logger/InfoLogger.js";
import errorLoger from "./Logger/errorLoger.js";
import config from "./config/index.js";
let server;

async function main() {
  try {
    // await mongoose.connect(config.database_url ?? "");
    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
      infoLogger.info(`app is listening on port ${config.port}`);
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

process.on("uncaughtException", () => {
  console.log(`😈 server is closed by uncaughtException error,`);
  errorLoger.error(`😈 server is closed by uncaughtException error,`);
  process.exit(1);
});
