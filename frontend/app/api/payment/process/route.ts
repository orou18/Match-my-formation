import { NextResponse } from "next/server";
import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

interface PaymentRequest {
  courseId: number;
  amount: number;
  currency: string;
  paymentMethodId: string;
  promoCode?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "stripe" | "bank_transfer";
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
  token?: string;
}

interface Transaction {
  id: string;
  userId: number;
  courseId: number;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  promoCode?: string;
  discountAmount: number;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json();
    const { courseId, amount, currency, paymentMethodId, promoCode } = body;

    // Simuler la validation du paiement
    // En production, cela intégrerait Stripe, PayPal, etc.
    
    // 1. Valider la méthode de paiement
    const paymentMethods: PaymentMethod[] = await readJsonStore("payment-methods", []);
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    
    if (!paymentMethod) {
      return NextResponse.json({
        success: false,
        message: "Méthode de paiement invalide"
      }, { status: 400 });
    }

    // 2. Valider le code promo si fourni
    let discountAmount = 0;
    if (promoCode) {
      // Simuler la validation du code promo
      const promoCodes: any[] = await readJsonStore("promo-codes", []);
      const validPromo = promoCodes.find((pc: any) => 
        pc.code === promoCode && 
        pc.courseId === courseId && 
        new Date(pc.expiresAt) > new Date()
      );
      
      if (validPromo) {
        discountAmount = (amount * validPromo.discount) / 100;
      }
    }

    const finalAmount = amount - discountAmount;

    // 3. Simuler le traitement du paiement
    // En production, cela appellerait l'API du fournisseur de paiement
    const paymentResult = await simulatePaymentProcessing(paymentMethod, finalAmount);

    // 4. Créer la transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 1, // En production, viendrait de la session
      courseId,
      amount: finalAmount,
      currency,
      status: paymentResult.success ? "completed" : "failed",
      paymentMethod: paymentMethodId,
      promoCode,
      discountAmount,
      createdAt: new Date().toISOString(),
      completedAt: paymentResult.success ? new Date().toISOString() : undefined,
      failureReason: paymentResult.success ? undefined : paymentResult.error,
    };

    // 5. Sauvegarder la transaction
    const transactions: Transaction[] = await readJsonStore("transactions", []);
    transactions.push(transaction);
    await writeJsonStore("transactions", transactions);

    // 6. Si succès, mettre à jour l'inscription de l'étudiant
    if (paymentResult.success) {
      await handleSuccessfulEnrollment(courseId, transaction.id);
    }

    return NextResponse.json({
      success: paymentResult.success,
      message: paymentResult.success 
        ? "Paiement traité avec succès" 
        : `Échec du paiement: ${paymentResult.error}`,
      transactionId: transaction.id,
      transaction: paymentResult.success ? transaction : undefined,
    });

  } catch (error) {
    console.error("Erreur traitement paiement:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur serveur lors du traitement du paiement"
    }, { status: 500 });
  }
}

async function simulatePaymentProcessing(paymentMethod: PaymentMethod, amount: number): Promise<{ success: boolean; error?: string }> {
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simuler un taux de succès de 95%
  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    return { success: true };
  } else {
    return { 
      success: false, 
      error: "Fonds insuffisants" 
    };
  }
}

async function handleSuccessfulEnrollment(courseId: number, transactionId: string) {
  try {
    // En production, cela mettrait à jour la base de données des parcours
    const parcours: any[] = await readJsonStore("student-parcours", []);
    
    const newEnrollment = {
      id: Date.now(),
      studentId: 1, // En production, viendrait de la session
      courseId,
      courseTitle: `Course ${courseId}`,
      courseThumbnail: `/course-${courseId}.jpg`,
      courseInstructor: "Instructor Name",
      progress: 0,
      totalModules: 10,
      completedModules: 0,
      timeSpent: 0,
      lastAccessed: new Date().toISOString(),
      status: "not_started" as const,
      enrolledAt: new Date().toISOString(),
      completedAt: undefined,
      certificateUrl: undefined,
      isPremium: true,
      price: 0, // Déjà payé
      paymentStatus: "completed" as const,
      transactionId,
    };

    parcours.push(newEnrollment);
    await writeJsonStore("student-parcours", parcours);

    console.log(`Inscription réussie pour le cours ${courseId} avec transaction ${transactionId}`);
  } catch (error) {
    console.error("Erreur inscription après paiement:", error);
  }
}

export async function GET() {
  try {
    // Récupérer les méthodes de paiement de l'utilisateur
    const paymentMethods: PaymentMethod[] = await readJsonStore("payment-methods", []);
    
    // Simuler des méthodes de paiement si aucune n'existe
    if (paymentMethods.length === 0) {
      const mockMethods: PaymentMethod[] = [
        {
          id: "pm_001",
          type: "card",
          last4: "4242",
          brand: "Visa",
          expiry: "12/25",
          isDefault: true,
          token: "tok_test_123456789"
        },
        {
          id: "pm_002",
          type: "card",
          last4: "5555",
          brand: "Mastercard",
          expiry: "08/24",
          isDefault: false,
          token: "tok_test_987654321"
        }
      ];
      
      await writeJsonStore("payment-methods", mockMethods);
      return NextResponse.json({
        success: true,
        methods: mockMethods
      });
    }

    return NextResponse.json({
      success: true,
      methods: paymentMethods
    });

  } catch (error) {
    console.error("Erreur méthodes paiement:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
