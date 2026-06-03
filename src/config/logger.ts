import winston from "winston";

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({
            stack: true,
        }),
        winston.format.json()
    ),

    transports: [
        new winston.transports.File({
            filename: "logs/success.log",
            level: "info",
        }),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});