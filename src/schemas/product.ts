import { z } from "zod";

export const CreatProductchema = z.object({
  name: z.string(),
  price: z.number(),
  cate_id: z.number(),
  shop_id: z.number(),
  // sub_cate_id: z.number(),
});
