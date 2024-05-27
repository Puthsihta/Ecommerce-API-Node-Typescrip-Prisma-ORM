import { Shop } from "@prisma/client";
import { prismaClient } from "..";
import { checkIsNew } from "./index.util";

export const updateIsNew = (shop: Shop[]) => {
  shop.map(async (item) => {
    let isNew = checkIsNew(item.created_at.toString());
    if (!isNew) {
      await prismaClient.shop.update({
        where: { id: item.id },
        data: {
          is_new: false,
        },
      });
    }
  });
};
