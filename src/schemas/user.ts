import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  phone: z.string().min(9),
  password: z.string().min(6),
});

export const sentSmsSchema = z.object({
  phone: z.string().min(9).includes("855", {
    message: "Phone number must include 855 at the beginning",
  }),
  is_debug: z.boolean(),
});
export const verifyOtpSchema = z.object({
  phone: z.string().min(9).includes("855", {
    message: "Phone number must include 855 at the beginning",
  }),
  otp: z.string().min(4),
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
