import { z } from "zod";

export const CreatShopSchema = z.object({
  name: z.string(),
  addressId: z.number(),
});
