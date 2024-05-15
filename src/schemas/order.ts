import { z } from "zod";

export const CreatOrderSchema = z.object({
  addressId: z.number(),
});
