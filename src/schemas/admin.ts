import { z } from "zod";

export const ChangePasswordSchema = z.object({
  user_id: z.string(),
  current_password: z.string().min(6),
  new_password: z.string().min(6),
});
