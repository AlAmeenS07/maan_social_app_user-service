import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { REQUEST_COMPLETED, USER_SERVICE } from "../utils/constants";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {

    const start = Date.now();

    res.on("finish", () => {

        logger.info(REQUEST_COMPLETED, {
            requestId: req.headers["x-request-id"],
            userId: req.headers["x-user-id"] || null,
            method: req.method,
            route: req.originalUrl,
            statusCode: res.statusCode,
            duration: Date.now() - start,
            service : USER_SERVICE
        });

    });

    next();
};