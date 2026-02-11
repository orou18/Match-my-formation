"use server";

import { PaymentSchema } from "@/lib/validations/payment";

export async function processPaymentAction(formData: any) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 2. Validation Zod
  const validatedFields = PaymentSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Les informations fournies sont incorrectes." };
  }

  try {
    /** * PLUS TARD : Intégration KKiapay / Laravel
     * const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll`, {
     * method: 'POST',
     * body: JSON.stringify(validatedFields.data)
     * });
     */

    console.log("Paiement simulé réussi pour :", validatedFields.data.email);
    return { success: true };
  } catch (e) {
    return { error: "Erreur de connexion avec le serveur." };
  }
}
