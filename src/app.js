import helmet from "helmet";
import express from "express";
import ApiNotFound from "./middlewares/NotFound.js";
import cors from "cors";
import globalErrorHandler from "./middlewares/GlobalErrorHanlder.js";

import router from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: ["*"] }));
app.use("/api/v1", router);

app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("wow server is working!!");
});
app.use(ApiNotFound);
export default app;
