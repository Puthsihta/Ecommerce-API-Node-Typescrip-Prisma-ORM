import { z } from "zod";

export const CreatOrderReviewSchema = z.object({
  order_id: z.number(),
  shop_id: z.number(),
  order_rating: z.number(),
  shop_rating: z.number(),
});
