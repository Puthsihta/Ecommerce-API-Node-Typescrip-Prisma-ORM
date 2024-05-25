import { z } from "zod";

export const CreatShopSchema = z.object({
  name: z.string(),
  addressId: z.number(),
});
export const ShopProductSchema = z.object({
  shop_id: z.string(),
});
