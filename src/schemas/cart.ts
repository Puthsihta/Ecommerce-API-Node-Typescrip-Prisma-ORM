import { z } from "zod";

export const CartSchema = z.object({
  productId: z.number(),
  qty: z.number(),
});

export const UpdateQtySchema = z.object({
  qty: z.number(),
});
