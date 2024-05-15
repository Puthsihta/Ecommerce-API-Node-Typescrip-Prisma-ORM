import { z } from "zod";

export const PaymentMethodSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.string(),
});
