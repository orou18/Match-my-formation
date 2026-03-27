import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { code, method } = await request.json();

    // Validation
    if (!code || !method) {
      return NextResponse.json(
        { error: "Code et méthode requis" },
        { status: 400 }
      );
    }

    if (code.length !== 6) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    // Mock verification - Remplacer par votre logique réelle
    console.log("Vérification 2FA pour:", session.user?.email);
    console.log("Code reçu:", code);
    console.log("Méthode:", method);

    // Pour les tests, accepter le code "123456"
    if (code === "123456") {
      // Simuler l'activation du 2FA
      console.log("2FA activé avec succès");

      return NextResponse.json({
        message: "2FA activé avec succès",
        twoFactorEnabled: true,
        twoFactorMethod: method,
      });
    }

    return NextResponse.json(
      { error: "Code de vérification invalide" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur lors de la vérification 2FA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
