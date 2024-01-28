import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const createOrder = async (req: any, res: Response, next: NextFunction) => {
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
        id: req.user.defaultShippinAddress,
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
    return res.json(order);
  });
};
const listOder = async (req: any, res: Response, next: NextFunction) => {
  const order = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.json(order);
};
const cancelStatus = async (
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
        status: "CANCEL",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: +req.params.id,
        status: "CANCEL",
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};
const listOrderById = async (req: any, res: Response, next: NextFunction) => {
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
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.PRODUCT_NOT_FOUNT);
  }
};

export { createOrder, listOder, cancelStatus, listOrderById };
