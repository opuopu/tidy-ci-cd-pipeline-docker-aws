import winston from "winston";

const errorLoger = winston.createLogger({
  level: "error",
  format: winston.format.combine(winston.format.json()),

  transports: [new winston.transports.Console()],
});
export default errorLoger;
