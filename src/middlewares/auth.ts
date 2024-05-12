import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../errors/unauthorized.expcetion";
import { ErrorCode } from "../errors/root.excpetion";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers.authorization;
  if (!token) {
    next(
      new UnAuthorizedException(false, "Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user: any = await prismaClient.user.findFirst({
      where: { id: payload.user_id },
    });
    if (!user) {
      next(
        new UnAuthorizedException(false, "Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }
    req.user = user;
    next();
  } catch (err) {
    next(
      new UnAuthorizedException(false, "Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }
};

export default authMiddleware;
