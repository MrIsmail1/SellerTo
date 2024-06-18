import { z } from "zod";

const productSchema = z.object({
  product_title: z.string().optional(),
  product_price: z.number().optional(),
  product_star_rating: z.number().optional(),
  product_url: z.string().optional(),
  product_photo: z.string().optional(),
  product_minimum_offer_price: z.number().optional(),
  product_category: z.string().optional(),
  is_best_seller: z.boolean().optional(),
  delivery: z.string().optional(),
  product_stock: z.number().optional(),
  data: z.any().optional(),
});

export type Product = z.infer<typeof productSchema>;
