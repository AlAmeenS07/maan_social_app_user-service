
import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, statusCodes } from "../utils/constants";


export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err : AppError, req : Request, res : Response, _next : NextFunction) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || statusCodes.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || INTERNAL_SERVER_ERROR,
  });
};