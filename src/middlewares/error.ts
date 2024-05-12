import { HTTPException } from "../errors/root.excpetion";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: HTTPException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    error: error.error,
    data: error.data,
  });
};
