import { Shop } from "@prisma/client";
import { checkExpireDate } from "./index.util";
import { prismaClient } from "..";

export const updateIsPromotion = (
  shop: Shop[],
  is_favorite: boolean = false
) => {
  shop.map(async (item: any) => {
    let whereClause: any = { id: item.id };
    if (is_favorite) {
      whereClause = { ...whereClause, is_favorite: true };
    }
    let isExpired = false;
    if (item.promotion) {
      isExpired = checkExpireDate(item.promotion.end_date.toString());
    }
    if (isExpired) {
      await prismaClient.shop.update({
        where: whereClause,
        data: {
          is_promotion: false,
          promotion: undefined,
        },
      });
    }
  });
};

export const updateProductDiscount = async () => {
  const products = await prismaClient.product.findMany();
  products.map(async (item) => {
    const shop: any = await prismaClient.shop.findFirst({
      where: {
        id: item.shopId,
      },
    });
    if (shop?.is_promotion) {
      if (item.follow_shop_discount != shop.promotion.promotion) {
        await prismaClient.product.update({
          where: {
            id: item.id,
          },
          data: {
            follow_shop_discount: shop.promotion.promotion,
          },
        });
      }
    } else {
      await prismaClient.product.update({
        where: {
          id: item.id,
        },
        data: {
          follow_shop_discount: null,
        },
      });
    }
  });
};
