import { z } from "zod";

export const AddPromoCodeSchema = z.object({
  code: z.string().min(1, { message: "Le code est requis." }),
  discount: z
    .number()
    .min(1, { message: "La remise doit être au moins de 1%." })
    .max(100, { message: "La remise ne peut pas dépasser 100." }),
  expiry_date: z.object({}).refine((data) => data != null, {
    message: "expiry_date is required",
  }),
  product_id: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const EditPromoCodeSchema = z.object({
  code: z.string().min(1, { message: "Le code est requis." }),
  discount: z
    .number()
    .min(0, { message: "La remise doit être au moins de 0." })
    .max(100, { message: "La remise ne peut pas dépasser 100." }),
  expiry_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La date d'expiration est requise et doit être valide.",
  }),
  product_id: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export type AddPromoCode = z.infer<typeof AddPromoCodeSchema>;
export type PromoCode = z.infer<typeof AddPromoCodeSchema>;
export type EditPromoCode = z.infer<typeof EditPromoCodeSchema>;
