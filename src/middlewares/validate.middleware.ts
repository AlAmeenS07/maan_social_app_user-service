import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { statusCodes } from "../utils/constants";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        errors: result.error.issues,
      });
    }

    // overwrite req.body with validated & sanitized data
    req.body = result.data;

    next(); // move to controller
  };