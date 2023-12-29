import winston from "winston";
const { combine, timestamp, label, printf, colorize } = winston.format;
const infoLogger = winston.createLogger({
  level: "info",
  format: combine(winston.format.json()),
  transports: [new winston.transports.Console()],
});

export default infoLogger;
