import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors, json } = format;

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

export const logger = createLogger({
  level: "info",
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    fileRotateTransport,
  ],
});

if (Bun.env.NODE_ENV === "production") {
  logger.add(
    new transports.Console({
      format: json(),
    })
  );
} else if (Bun.env.NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `[${timestamp}]:${level}: ${message}`;
        })
      ),
    })
  );
}
