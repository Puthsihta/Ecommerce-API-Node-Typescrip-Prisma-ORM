import { Request, Response } from "express";
import {
  CreatShopSchema,
  ShopProductSchema,
  ShopPromotionSchema,
} from "../schemas/shop";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import {
  checkExpireDate,
  checkIsNew,
  checkValidationDate,
} from "../utils/index.util";
import { updateIsPromotion } from "../utils/updateIsPromtion";
import { Prisma } from "@prisma/client";
import { updateIsNew } from "../utils/updateIsNew";

const creatShop = async (req: Request, res: Response) => {
  CreatShopSchema.parse(req.body);
  //check address
  const address = await prismaClient.address.findFirst({
    where: {
      id: +req.body.addressId,
    },
  });
  if (address) {
    await prismaClient.shop.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.json({ message: true, data: "Shop Create Successfully!" });
  } else {
    throw new NotFoundException(
      false,
      "Address not found",
      ErrorCode.NOT_FOUNT
    );
  }
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
  const shops = await prismaClient.shop.findMany();
  updateIsPromotion(shops);
  updateIsNew(shops);
  const result = await prismaClient.shop.findMany({
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
    data: result,
  });
};
const listShopByID = async (req: Request, res: Response) => {
  try {
    const shop: any = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    let isNew = checkIsNew(shop.created_at.toString());
    let isExpired = false;
    if (shop.promotion) {
      isExpired = checkExpireDate(shop.promotion.end_date);
    }
    if (!isNew) {
      await prismaClient.shop.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_new: false,
        },
      });
    }
    if (isExpired) {
      await prismaClient.shop.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_promotion: false,
          promotion: undefined,
        },
      });
    }
    const result = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    res.json({ message: true, data: result });
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
const favoriteShop = async (req: Request, res: Response) => {
  try {
    const shop = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    await prismaClient.shop.update({
      where: {
        id: +req.params.id,
      },
      data: {
        is_favorite: !shop.is_favorite,
      },
    });
    res.json({
      message: true,
      data: shop.is_favorite
        ? "UnFavorite Successfully"
        : "Favorite Successfully",
    });
  } catch (err) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};

const listFavoritesShop = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.shop.count({
    where: {
      is_favorite: true,
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;

  const shops = await prismaClient.shop.findMany({
    where: {
      is_favorite: true,
    },
  });
  updateIsPromotion(shops, true);
  updateIsNew(shops, true);
  const result = await prismaClient.shop.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      is_favorite: true,
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: result,
  });
};

const listProductbyShop = async (req: Request, res: Response) => {
  ShopProductSchema.parse(req.query);
  // pagenation
  const shop_id = req.query.shop_id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.product.count({
    where: {
      shopId: Number(shop_id),
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;
  const product_by_shop = await prismaClient.product.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      shopId: Number(shop_id),
    },
    select: {
      subCategory: {
        include: {
          product: true,
        },
      },
    },
  });
  res.json({
    message: true,
    limit: limit,
    currentPage,
    totalPage,
    total: totalCount,
    data: product_by_shop,
  });
};

const addShopPromotion = async (req: Request, res: Response) => {
  ShopPromotionSchema.parse(req.body);
  try {
    const shop = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    let isValidDate = checkValidationDate(
      req.body.start_date,
      req.body.end_date
    );
    if (!isValidDate) {
      throw new NotFoundException(
        false,
        "Invalid Date",
        ErrorCode.UNPROCESSABLE
      );
    }
    await prismaClient.shop.update({
      where: {
        id: +req.params.id,
      },
      data: {
        is_promotion: !shop.is_promotion,
        promotion: shop.is_promotion
          ? undefined
          : {
              ...req.body,
            },
      },
    });
    res.json({
      message: true,
      data: shop.is_promotion
        ? "UnPromotion Successfully"
        : "Promotion Successfully",
    });
  } catch (err) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};

export {
  creatShop,
  listShop,
  listShopByID,
  updateShop,
  deleteShop,
  closeShop,
  favoriteShop,
  listFavoritesShop,
  listProductbyShop,
  addShopPromotion,
};
