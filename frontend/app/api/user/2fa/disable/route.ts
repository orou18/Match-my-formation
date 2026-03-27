import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Mock 2FA disable - Remplacer par votre logique réelle
    console.log("Désactivation 2FA pour:", session.user?.email);

    // Simuler la désactivation du 2FA
    return NextResponse.json({
      message: "2FA désactivé avec succès",
      twoFactorEnabled: false,
    });
  } catch (error) {
    console.error("Erreur lors de la désactivation 2FA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
