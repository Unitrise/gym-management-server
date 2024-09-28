import winston from 'winston';
import 'winston-daily-rotate-file';

// Define custom log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

// Create Winston logger with transports
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Capture stack traces
    winston.format.splat(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.DailyRotateFile({
      dirname: './logs', // Directory to save logs
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true,
    }),
  ],
});

// Export the logger as a service
export default logger;
