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

export const updateProductDiscount = async () => {
  const products = await prismaClient.product.findMany();
  products.map(async (item) => {
    const shop = await prismaClient.shop.findFirst({
      where: {
        id: item.shop_id,
      },
    });
    console.log("shop : ", shop);
    // if (shop?.is_promotion) {
    //   if (item.follow_shop_discount != shop) {
    //     await prismaClient.product.update({
    //       where: {
    //         id: item.id,
    //       },
    //       data: {
    //         follow_shop_discount: shop.promotion.promotion,
    //       },
    //     });
    //   }
    // } else {
    //   await prismaClient.product.update({
    //     where: {
    //       id: item.id,
    //     },
    //     data: {
    //       follow_shop_discount: null,
    //     },
    //   });
    // }
  });
};
