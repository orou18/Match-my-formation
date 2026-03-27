import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Simuler la vérification du mot de passe actuel
    // En production, vous vérifieriez contre le hash stocké
    if (currentPassword !== "Azerty123!") {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    // Simuler le changement de mot de passe
    // En production, vous hasheriez le nouveau mot de passe et le stockeriez
    console.log(
      "ADMIN PROFILE - Mot de passe changé pour:",
      (session.user as any).email
    );

    return NextResponse.json({
      message: "Mot de passe modifié avec succès",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ADMIN PROFILE - Erreur changement mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
