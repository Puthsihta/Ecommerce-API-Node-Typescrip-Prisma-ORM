import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { AddressSchema } from "../schemas/user";

const createAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });

  res.json({ message: true, data: address });
};

const listAddress = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.address.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const address = await prismaClient.address.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      userId: +req.user.id,
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: address,
  });
};

const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
        userId: req.user.id,
      },
    });
    res.json({ message: true, data: "Address deleted successfully" });
  } catch (err) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};

export { createAddress, listAddress, deleteAddress };
