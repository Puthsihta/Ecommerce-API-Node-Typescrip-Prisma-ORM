import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippinAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
});
