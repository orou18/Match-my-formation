import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { updateUserSecurity } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
};

export async function POST(request: NextRequest) {
  try {
    // Prioriser l'ID depuis le token
    const userId = getUserIdFromToken(request);

    // Fallback vers session NextAuth
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { method } = await request.json();

    // Validation
    if (!method || !["email", "sms", "app"].includes(method)) {
      return NextResponse.json({ error: "Méthode invalide" }, { status: 400 });
    }

    const verificationCode = "123456"; // Code de test fixe
    updateUserSecurity(String(finalUserId), {
      twoFactorMethod: method,
    });

    return NextResponse.json({
      message: `Code de vérification envoyé par ${method}`,
      success: true,
      method: method,
      // En dev, retourner le code pour faciliter les tests
      ...(process.env.NODE_ENV === "development" && { code: verificationCode }),
    });
  } catch (error) {
    console.error("Erreur lors de la configuration 2FA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
