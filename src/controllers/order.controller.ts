import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { OrderStatus } from "../constants/index.constants";
import { CreatOrderSchema } from "../schemas/order";

const createOrder = async (req: Request, res: Response) => {
  CreatOrderSchema.parse(req.body);
  // 1. create transaction
  await prismaClient.$transaction(async (tx) => {
    // fetch user addresss
    const address = await tx.address.findFirst({
      where: {
        id: req.body.addressId,
      },
    });

    if (address) {
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          amount: 1,
          addressId: address.id,
        },
      });
      // order even
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });
      return res.json({ message: true, data: "Order Successfully!" });
    } else {
      throw new NotFoundException(
        false,
        "Address Not Found",
        ErrorCode.NOT_FOUNT
      );
    }
  });
};
const listOder = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.order.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const order = await prismaClient.order.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      userId: req.user.id,
    },
  });

  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: order,
  });
};
const cancelStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: OrderStatus.CANCEL,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: +req.params.id,
        status: OrderStatus.CANCEL,
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(
      false,
      "Product not found",
      ErrorCode.NOT_FOUNT
    );
  }
};
const listOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
        address: true,
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(false, "Order not found", ErrorCode.NOT_FOUNT);
  }
};

export { createOrder, listOder, cancelStatus, listOrderById };
