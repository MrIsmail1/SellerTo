import { z } from "zod";

export const AddStockSchema = z.object({
    id: z.number().int().optional(),
    productId: z.number().int()
        .refine(val => val !== undefined, { message: "L'ID du produit est requis." })
        .refine(val => true, { message: "L'ID du produit doit être un nombre." }),
    quantity: z
        .number()
        .int()
        .min(1, { message: "La quantité doit être au moins de 1." })
        .max(10000, { message: "La quantité ne peut pas dépasser 10000." }),
    operationType: z
        .enum(["ADD", "REMOVE"], {
            errorMap: (issue, ctx) => {
                return {
                    message: "Le type d'opération doit être l'un des suivants: ADD, REMOVE.",
                };
            },
        })
        .default("ADD"),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
});

export const EditStockSchema = z.object({
    id: z.number().int().optional(),
    productId: z.number().int()
        .refine(val => val !== undefined, { message: "L'ID du produit est requis." })
        .refine(val => true, { message: "L'ID du produit doit être un nombre." }),
    quantity: z
        .number()
        .int()
        .min(1, { message: "La quantité doit être au moins de 1." })
        .max(10000, { message: "La quantité ne peut pas dépasser 10000." }),
    operationType: z
        .enum(["ADD", "REMOVE"], {
            errorMap: (issue, ctx) => {
                return {
                    message: "Le type d'opération doit être l'un des suivants: ADD, REMOVE.",
                };
            },
        })
        .default("ADD"),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
});

export type AddStock = z.infer<typeof AddStockSchema>;
export type Stock = z.infer<typeof AddStockSchema>;
export type EditStock = z.infer<typeof EditStockSchema>;
