import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { AddressSchema } from "../schemas/user";

const createAddress = async (req: any, res: Response, next: NextFunction) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });

  res.json(address);
};

const listAddress = async (req: any, res: Response, next: NextFunction) => {
  const address = await prismaClient.address.findMany({
    where: {
      userId: +req.user.id,
    },
  });
  res.json(address);
};

const deleteAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
        userId: req.user.id,
      },
    });
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.PRODUCT_NOT_FOUNT
    );
  }
};

export { createAddress, listAddress, deleteAddress };
