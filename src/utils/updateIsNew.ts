import { Shop } from "@prisma/client";
import { prismaClient } from "..";
import { checkIsNew } from "./index.util";

export const updateIsNew = (shop: Shop[], is_favorite: boolean = false) => {
  shop.map(async (item) => {
    let whereClause: any = { id: item.id };
    if (is_favorite) {
      whereClause = { ...whereClause, is_favorite: true };
    }
    let isNew = checkIsNew(item.created_at.toString());
    if (!isNew) {
      await prismaClient.shop.update({
        where: whereClause,
        data: {
          is_new: false,
        },
      });
    }
  });
};
