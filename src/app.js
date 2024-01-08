import helmet from "helmet";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import ApiNotFound from "./middlewares/NotFound.js";
import cors from "cors";
import globalErrorHandler from "./middlewares/GlobalErrorHanlder.js";

import router from "./routes/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// to access static images file from public directory
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(helmet());
app.use(express.json());

app.use(cors({ origin: ["*"] }));
app.use("/api/v1", router);

app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("wow server is working!!");
});
app.use(ApiNotFound);
export default app;
