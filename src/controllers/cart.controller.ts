import { Request, Response } from "express";
import { prismaClient } from "..";
import { CartSchema, UpdateQtySchema } from "../schemas/cart";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { Product } from "@prisma/client";

const addCart = async (req: Request, res: Response) => {
  const validation = CartSchema.parse(req.body);
  let product: Product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validation.productId,
      },
    });
    const addCart = await prismaClient.cart.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        qty: validation.qty,
      },
    });

    res.json(addCart);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};
const deleteCart = async (req: Request, res: Response) => {
  try {
    await prismaClient.cart.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};
const changeQty = async (req: Request, res: Response) => {
  const validation = UpdateQtySchema.parse(req.body);
  try {
    const updateQty = await prismaClient.cart.update({
      where: {
        id: +req.params.id,
      },
      data: {
        qty: validation.qty,
      },
    });

    res.json(updateQty);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};
const listCart = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.cart.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;
  const carts = await prismaClient.cart.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      userId: req.user.id,
    },
    include: {
      product: true,
    },
  });

  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: carts,
  });
};

export { addCart, deleteCart, changeQty, listCart };
