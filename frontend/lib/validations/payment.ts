import { z } from "zod";

export const PaymentSchema = z.object({
  email: z.string().email("Email invalide"),
  planId: z.string().min(1, "Plan non sélectionné"),
  paymentMethod: z.enum(["card", "mtn", "moov", "kkiapay"]),
  amount: z.number(),
});
