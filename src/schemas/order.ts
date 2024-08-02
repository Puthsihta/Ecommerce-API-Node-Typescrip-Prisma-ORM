import { z } from "zod";

export const CreatOrderSchema = z.object({
  product: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    })
  ),
  shop_id: z.number(),
  address_id: z.number(),
  payment_id: z.number(),
});
