import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddressSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
});
