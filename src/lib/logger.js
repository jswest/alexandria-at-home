import pino from "pino";

const logger = pino({
  name: "alexandria",
  level: process.env.LOG_LEVEL || "info",
});

export default logger;
