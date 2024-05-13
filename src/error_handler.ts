import { NextFunction, Request, Response } from "express";
import { ErrorCode, HTTPException } from "./errors/root.excpetion";
import { InternalException } from "./errors/internal_error.excpetion";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err) {
      let exception: HTTPException;
      if (err instanceof HTTPException) {
        exception = err;
      } else {
        exception = new InternalException(
          false,
          "Something went wrong",
          err,
          ErrorCode.INTERNAL_ERROR
        );
      }
      next(exception);
    }
  };
};
