import { z } from "zod";

export const CreatOrderSchema = z.object({
  product: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    })
  ),
  addressId: z.number(),
  paymentId: z.number(),
});
