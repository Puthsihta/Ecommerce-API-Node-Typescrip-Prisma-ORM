import { Request, Response } from "express";
import { CreatShopSchema, ShopProductSchema } from "../schemas/shop";
import { prismaClient } from "..";
import { NotFoundException } from "../errors/not_found.excpetion";
import { ErrorCode } from "../errors/root.excpetion";
import { checkValidationDate } from "../utils/index.util";
import {
  updateIsPromotion,
  updateProductDiscount,
} from "../utils/updateIsPromtion";
import { updateIsNew } from "../utils/updateIsNew";

const creatShop = async (req: Request, res: Response) => {
  CreatShopSchema.parse(req.body);
  //check address
  const address = await prismaClient.address.findFirst({
    where: {
      id: +req.body.address_id,
    },
  });
  if (address) {
    await prismaClient.shop.create({
      data: {
        ...req.body,
        user_id: req.user.id,
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
  updateIsPromotion(); // check if promotion expired
  updateIsNew(); // check if show is not new
  const result = await prismaClient.shop.findMany({
    skip: startIndex,
    take: Number(limit),
    where: whereClause,
    include: {
      promotion: true,
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
const listShopByID = async (req: Request, res: Response) => {
  try {
    const shop: any = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
      include: {
        promotion: true,
      },
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
        is_active: false,
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

  const result = await prismaClient.shop.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      is_favorite: true,
    },
    include: {
      promotion: true,
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
      shop_id: Number(shop_id),
    },
  });
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;
  const product_by_shop = await prismaClient.product.findMany({
    skip: startIndex,
    take: Number(limit),
    where: {
      shop_id: Number(shop_id),
    },
    select: {
      sub_category: {
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
  // ShopPromotionSchema.parse(req.body);
  let isValidDate = checkValidationDate(req.body.start_date, req.body.end_date);
  if (isValidDate) {
    try {
      const shop = await prismaClient.shop.findFirstOrThrow({
        where: { id: +req.params.id },
      });
      await prismaClient.shop.update({
        where: {
          id: shop.id,
        },
        data: {
          is_promotion: true,
        },
      });
      await prismaClient.promotionShop.create({
        data: {
          ...req.body,
          shop_id: shop.id,
        },
      });
      updateProductDiscount();
      res.json({
        message: true,
        data: "Promotion Successfully",
      });
    } catch (err) {
      throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
    }
  } else {
    throw new NotFoundException(false, "Invalid Date", ErrorCode.UNPROCESSABLE);
  }
};

const cancelPromotion = async (req: Request, res: Response) => {
  try {
    const shop = await prismaClient.shop.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    const promotionShop = await prismaClient.promotionShop.findFirstOrThrow({
      where: { shop_id: +shop.id },
    });
    await prismaClient.shop.update({
      where: {
        id: shop.id,
      },
      data: {
        is_promotion: false,
      },
    });
    await prismaClient.promotionShop.delete({
      where: {
        id: promotionShop.id,
      },
    });
    updateProductDiscount();
    res.json({
      message: true,
      data: "UnPromotion Successfully",
    });
  } catch (err) {
    throw new NotFoundException(false, "Shop not found", ErrorCode.NOT_FOUNT);
  }
};

const promotionShop = async (req: Request, res: Response) => {
  // pagenation
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (Number(page) - 1) * Number(limit);
  const totalCount = await prismaClient.shop.count();
  const totalPage = Math.ceil(totalCount / Number(limit));
  const currentPage = +page || 1;
  const result = await prismaClient.promotionShop.findMany({
    skip: startIndex,
    take: Number(limit),
    include: {
      shop: true,
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
  cancelPromotion,
  promotionShop,
};
