import { z } from "zod";

export const CreatSettingSchema = z.object({
  title: z.string(),
  type: z.string(),
});
