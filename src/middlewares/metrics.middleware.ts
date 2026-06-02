import { Request, Response, NextFunction } from "express";
import { httpErrorsTotal, httpRequestDuration, httpRequestsTotal } from "../observability/metrics";
import { statusCodes } from "../utils/constants";


export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = (Date.now() - start) / 1000;

        const route = req.originalUrl;

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status: String(res.statusCode)
        });

        httpRequestDuration.observe(
            {
                method: req.method,
                route
            },
            duration
        );

        if (res.statusCode >= statusCodes.BAD_REQUEST) {

            httpErrorsTotal.inc({
                route,
                status: String(res.statusCode)
            });

        }

    });

    next();
};