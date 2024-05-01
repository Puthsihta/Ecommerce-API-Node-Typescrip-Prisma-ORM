import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const listUser = async (req: any, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip || 0,
    take: 10,
  });
  res.json(users);
};

const getUserByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresss: true,
      },
    });
    res.json(users);
  } catch (err) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: req.body.role,
      },
    });
    res.json(users);
  } catch (err) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.USER_NOT_FOUND);
  }
};
const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  let whereClause: any = {};
  const status = req.query.status;
  const userId = Number(req.query.userId);
  if (status) {
    whereClause = { status };
  }
  if (userId) {
    whereClause = { ...whereClause, userId };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: 10,
  });

  res.json(orders);
};

export { listUser, getUserByID, changeUserRole, listOrders, updateOrderStatus };
