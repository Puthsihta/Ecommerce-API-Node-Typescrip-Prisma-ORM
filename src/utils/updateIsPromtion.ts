import { checkExpireDate } from "./index.util";
import { prismaClient } from "..";

export const updateIsPromotion = async () => {
  const shops = await prismaClient.shop.findMany();
  shops.map(async (item: any) => {
    let isExpired = false;
    if (item.promotion) {
      isExpired = checkExpireDate(item.promotion.end_date.toString());
    }
    if (isExpired) {
      await prismaClient.shop.update({
        where: { id: item.id },
        data: {
          is_promotion: false,
          promotion: undefined,
        },
      });
    }
  });
};

export const updateProductDiscount = async (
  shopId: number,
  isPromotion: boolean
) => {
  const shop = await prismaClient.shop.findFirst({
    where: {
      id: shopId,
    },
    select: {
      product: true,
      promotion: true,
    },
  });
  // console.log("shop : ", shop);
  if (shop) {
    shop.product.map(async (product) => {
      if (isPromotion) {
        await prismaClient.product.update({
          where: {
            id: product.id,
          },
          data: {
            follow_shop_discount: shop.promotion[0].promotion,
          },
        });
      } else {
        await prismaClient.product.update({
          where: {
            id: product.id,
          },
          data: {
            follow_shop_discount: null,
          },
        });
      }
    });
  }
};
