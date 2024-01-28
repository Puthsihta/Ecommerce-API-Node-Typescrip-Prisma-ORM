import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../errors/unauthorized.expcetion";
import { ErrorCode } from "../errors/root.excpetion";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";

const authMiddleware: any = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers.authorization;
  if (!token) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user: any = await prismaClient.user.findFirst({
      where: { id: payload.user_id },
    });
    if (!user) {
      next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user;
    // console.log("User : ", user);
    next();
  } catch (err) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
