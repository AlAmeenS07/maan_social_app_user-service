
import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../utils/constants";


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

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || INTERNAL_SERVER_ERROR,
  });
};