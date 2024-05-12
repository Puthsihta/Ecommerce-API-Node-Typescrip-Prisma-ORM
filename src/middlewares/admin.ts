import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../errors/unauthorized.expcetion";
import { ErrorCode } from "../errors/root.excpetion";
import { Role } from "../constants/index.constants";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == Role.admin) {
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
