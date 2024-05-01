import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

const listProduct = async (req: any, res: Response, next: NextFunction) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req?.query?.skip || 0,
    take: 10,
  });
  res.json({ total: count, limit: 10, data: products });
};

const listProductByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    res.json(product);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.json(updateProduct);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};

export {
  createProduct,
  listProduct,
  listProductByID,
  updateProduct,
  deleteProduct,
};
