import { z } from "zod";

export const AddUserSchema = z.object({
  id: z.number().int().optional(),
  firstname: z
    .string()
    .min(1, { message: "Le prénom est requis..." })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères..." }),
  lastname: z
    .string()
    .min(1, { message: "Le nom est requis..." })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères..." }),
  email: z.string().email({ message: "L'adresse e-mail doit être valide..." }),
  password: z.string().min(12, {
    message: "Le mot de passe doit contenir au moins 12 caractères...",
  }),
  role: z
    .enum(["SuperAdmin", "Admin", "User"], {
      errorMap: (issue, ctx) => {
        return {
          message:
            "Le rôle doit être l'un des suivants: SuperAdmin, Admin, User.",
        };
      },
    })
    .default("User"),
  isVerified: z.boolean().default(false),
  address: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

export const EditUserSchema = z.object({
  id: z.number().int().optional(),
  firstname: z
    .string()
    .min(1, { message: "Le prénom est requis..." })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères..." }),
  lastname: z
    .string()
    .min(1, { message: "Le nom est requis..." })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères..." }),
  email: z.string().email({ message: "L'adresse e-mail doit être valide..." }),
  password: z
    .string()
    .min(12, {
      message: "Le mot de passe doit contenir au moins 12 caractères...",
    })
    .optional(),
  role: z
    .enum(["SuperAdmin", "Admin", "User"], {
      errorMap: (issue, ctx) => {
        return {
          message:
            "Le rôle doit être l'un des suivants: SuperAdmin, Admin, User.",
        };
      },
    })
    .default("User"),
  isVerified: z.string(),
  address: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

export type AddUser = z.infer<typeof AddUserSchema>;
export type User = z.infer<typeof AddUserSchema>;
export type EditUser = z.infer<typeof EditUserSchema>;
