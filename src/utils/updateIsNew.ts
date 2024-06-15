import { prismaClient } from "..";
import { checkIsNew } from "./index.util";

export const updateIsNew = async () => {
  const shops = await prismaClient.shop.findMany();
  shops.map(async (item) => {
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
