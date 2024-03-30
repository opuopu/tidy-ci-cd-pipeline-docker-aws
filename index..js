import helmet from "helmet";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";
import globalErrorHandler from "./src/middlewares/GlobalErrorHanlder.js";
import router from "./src/routes/index.js";
import ApiNotFound from "./src/middlewares/NotFound.js";
export const app = express();
app.use(express.static("public"));

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: ["*"] }));

app.get("/", (req, res) => { 
  res.send("wow server is working!!");
});
app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(ApiNotFound);
export default app;
