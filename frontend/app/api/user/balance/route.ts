import { NextResponse } from "next/server";
import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

interface UserBalance {
  userId: number;
  balance: number;
  currency: string;
  lastUpdated: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  userId: number;
  type: "credit" | "debit" | "purchase" | "refund";
  amount: number;
  currency: string;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  relatedEntity?: {
    type: "course" | "subscription" | "refund";
    id: number;
    name: string;
  };
}

export async function GET() {
  try {
    // Pour l'instant, nous allons simuler les données
    // En production, cela viendrait d'une vraie base de données bancaire
    const balances: UserBalance[] = await readJsonStore("user-balances", []);

    // Simuler un utilisateur avec un solde
    const mockBalance: UserBalance = {
      userId: 1,
      balance: 150.5,
      currency: "EUR",
      lastUpdated: new Date().toISOString(),
      transactions: [
        {
          id: "txn_001",
          userId: 1,
          type: "credit",
          amount: 100.0,
          currency: "EUR",
          description: "Rechargement compte",
          status: "completed",
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          completedAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "txn_002",
          userId: 1,
          type: "debit",
          amount: 25.0,
          currency: "EUR",
          description: "Achat cours Python",
          status: "completed",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          completedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          relatedEntity: {
            type: "course",
            id: 101,
            name: "Python pour les débutants",
          },
        },
      ],
    };

    return NextResponse.json({
      success: true,
      balance: mockBalance.balance,
      currency: mockBalance.currency,
      lastUpdated: mockBalance.lastUpdated,
      transactions: mockBalance.transactions,
    });
  } catch (error) {
    console.error("Erreur solde utilisateur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, amount, description } = body;

    // Simuler une transaction
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId: 1,
      type: action === "credit" ? "credit" : "debit",
      amount: amount,
      currency: "EUR",
      description: description || "Transaction",
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // En production, cela mettrait à jour la base de données bancaire
    return NextResponse.json({
      success: true,
      message: "Transaction traitée avec succès",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Erreur transaction:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
