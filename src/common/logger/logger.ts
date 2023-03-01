import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  defaultMeta: { service: process.env.SERVICE_NAME || '' },
  format: winston.format.combine(
    winston.format((info) => {
      return info;
    })(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.metadata(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, metadata }) => {
      return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(metadata)}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
