import { Response } from "express";
import { AppError } from "../middlewares/error.middleware";

export const successResponse = <T>(res : Response, data : T, message: string = "Success", status : number = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (message : string, status = 500) => {
  throw new AppError(message , status);
};