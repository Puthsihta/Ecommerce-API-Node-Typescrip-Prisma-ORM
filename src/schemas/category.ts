import { z } from "zod";

export const CreatCategorySchema = z.object({
  name: z.string(),
});
export const CreatSubCategorySchema = z.object({
  name: z.string(),
  cateId: z.number(),
});
