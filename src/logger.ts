import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = path.resolve(__dirname, '..', 'logs');

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'verbose',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf(({ timestamp, level, message, context }) => {
      return `${timestamp} ${level.toUpperCase()} [${context}] ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [dailyRotateFileTransport]
      : []),
  ],
});

export default logger;
