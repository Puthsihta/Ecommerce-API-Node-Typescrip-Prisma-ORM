import { NextFunction, Request, Response } from "express";
import { ErrorCode, HTTPException } from "./errors/root.excpetion";
import { InternalException } from "./errors/internal_error.excpetion";

export const errorHandler: any = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err: any) {
      let exception: HTTPException;
      if (err instanceof HTTPException) {
        // console.log("IN err instanceof HTTPException");
        exception = err;
      } else {
        // console.log("IN InternalException");
        exception = new InternalException(
          "Something went wrong",
          err,
          ErrorCode.INTERNAL_ERROR
        );
      }
      next(exception);
    }
  };
};
