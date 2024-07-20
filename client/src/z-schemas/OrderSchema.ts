import { z } from "zod";

const OrderSchema = z.object({
  id: z.number().int().positive().optional(),
  orderUnique: z.number().int().positive(),
  quantity: z.number().int().positive(),
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  amount: z.number().positive(),
  status: z.string().optional(),
  paymentIntentId: z.string(),
  trackingCode: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export default OrderSchema;
