import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const createOrder = async (req: Request, res: Response) => {
  // 1. create transaction
  await prismaClient.$transaction(async (tx) => {
    // 2. list all cart
    const cart = await tx.cart.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cart.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    // 3. calculate total amount
    const price = cart.reduce((prev, current) => {
      return prev + current.qty * +current.product.price;
    }, 0);
    // 4. fetch user addresss
    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippinAddress ?? 1,
      },
    });
    //6. creaet order
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        amount: price,
        // 5. define formatedAddress in index.ts (extent prisma)
        address: String(address?.formattedAddress),
        products: {
          create: cart.map((cart) => {
            return {
              productId: cart.productId,
              qty: cart.qty,
            };
          }),
        },
      },
    });
    // 7. order even
    const orderEven = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    //8. empty cart
    await tx.cart.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json({ message: true, data: order });
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
        status: "CANCEL",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: +req.params.id,
        status: "CANCEL",
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
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
      },
    });
    res.json({ message: true, data: order });
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.PRODUCT_NOT_FOUNT);
  }
};

export { createOrder, listOder, cancelStatus, listOrderById };
