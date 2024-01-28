import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../errors/unauthorized.expcetion";
import { ErrorCode } from "../errors/root.excpetion";

const adminMiddleware: any = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log("role : ", user.role);
  if (user.role == "ADMIN") {
    next();
  } else {
    next(
      new UnAuthorizedException(
        "Unauthorized, This User is not Admin",
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default adminMiddleware;
