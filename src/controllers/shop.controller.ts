import { Request, Response } from "express";
import { CreatShopSchema } from "../schemas/shop";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";

const creatShop = async (req: Request, res: Response) => {
  CreatShopSchema.parse(req.body);
  await prismaClient.shop.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json({ message: true, data: "Shop Create Successfully!" });
};
const listShop = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.shop.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const search = String(req.query.search);
  let whereClause = {};
  if (req.query.search) {
    whereClause = { name: { search } };
  }

  const shops = await prismaClient.shop.findMany({
    skip: startIndex,
    take: Number(limit),
    where: whereClause,
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: shops,
  });
};
const listShopByID = async (req: Request, res: Response) => {
  try {
    const shop = await prismaClient.shop.findFirst({
      where: { id: +req.params.id },
    });
    res.json({ message: true, data: shop });
  } catch (err) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};
const updateShop = async (req: Request, res: Response) => {
  CreatShopSchema.parse(req.body);
  try {
    await prismaClient.shop.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    res.json({ message: true, data: "Shop Updated Successfully!" });
  } catch (error) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};
const deleteShop = async (req: Request, res: Response) => {
  try {
    await prismaClient.shop.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: true, data: "Shop deleted successfully" });
  } catch (error) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};
const closeShop = async (req: Request, res: Response) => {
  try {
    await prismaClient.shop.update({
      where: {
        id: +req.params.id,
      },
      data: {
        isActive: false,
      },
    });
    res.json({ message: true, data: "Shop closed successfully" });
  } catch (error) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};

export { creatShop, listShop, listShopByID, updateShop, deleteShop, closeShop };
