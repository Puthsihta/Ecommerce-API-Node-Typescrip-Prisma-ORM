import { z } from "zod";

export const CreatShopSchema = z.object({
  name: z.string(),
  addressId: z.number(),
});
export const ShopProductSchema = z.object({
  shop_id: z.string(),
});
export const ShopPromotionSchema = z.object({
  lable: z.string(),
  promotion: z.number(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
});
