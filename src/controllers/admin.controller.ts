import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { Role } from "../constants/index.constants";

const listUser = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.user.count({
    where: {
      role: req.query.role ? String(req.query.role) : Role.user,
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const search = String(req.query.search);
  const role = req.query.role ? String(req.query.role) : Role.user;
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search }, email: { search } };
  }
  if (req.query.role) {
    whereClause = { ...whereClause, role };
  }

  const users = await prismaClient.user.findMany({
    skip: startIndex,
    take: Number(limit),
    where: whereClause,
    select: {
      id: true,
      password: false,
      addresss: false,
      name: true,
      email: true,
      role: true,
      image_url: true,
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: users,
  });
};

const getUserByID = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      select: {
        id: true,
        password: false,
        name: true,
        email: true,
        role: true,
        image_url: true,
        addresss: true,
      },
    });
    res.json({ message: true, data: users });
  } catch (err) {
    throw new NotFoundException(false, "User not found", ErrorCode.NOT_FOUNT);
  }
};

const changeUserRole = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: req.body.role,
      },
      select: {
        id: true,
        password: false,
        addresss: false,
        name: true,
        email: true,
        role: true,
        image_url: true,
      },
    });
    res.json({ message: true, dat: users });
  } catch (err) {
    throw new NotFoundException(false, "User not found", ErrorCode.NOT_FOUNT);
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: +req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: +req.body.status,
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(false, "Order not found", ErrorCode.NOT_FOUNT);
  }
};
const listOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = Number(req.query.status);
  const userId = Number(req.query.userId);
  const search = String(req.query.search);

  if (req.query.search) {
    whereClause = { invoice_no: { search } };
  }
  if (status) {
    whereClause = { ...whereClause, status };
  }
  if (userId) {
    whereClause = { ...whereClause, userId };
  }
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.order.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: startIndex,
    take: Number(limit),
  });

  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: orders,
  });
};

export { listUser, getUserByID, changeUserRole, listOrders, updateOrderStatus };
