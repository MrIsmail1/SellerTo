import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().optional(),
  firstname: z.string().min(1).max(50),
  lastname: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(12),
  resetPasswordToken: z.string().optional().nullable(),
  resetPasswordExpire: z.date().optional().nullable(),
  passwordChangedAt: z.date().optional().nullable(),
  role: z.enum(["users", "admin"]).default("users"),
  confirmationToken: z.string().optional().nullable(),
  confirmationTokenExpires: z.date().optional().nullable(),
  isVerified: z.boolean().default(false),
  loginAttempts: z.number().int().default(0),
  lockUntil: z.date().optional().nullable(),
  address: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;
