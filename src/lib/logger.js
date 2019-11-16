import log4js from 'log4js';
import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;



const logger = winston.createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp(),
        printf(info => {
            return `${info.timestamp} [${info.service}] [${info.level}] : ${JSON.stringify(info.message)}`;
        })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

export default  logger;