import { z } from "zod";

export const CreatProductchema = z.object({
  name: z.string(),
  price: z.number(),
  cateId: z.number(),
  subCateId: z.number(),
});
