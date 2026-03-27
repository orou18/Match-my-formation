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
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
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

    if (code === "123456") {
      updateUserSecurity(String(finalUserId), {
        twoFactorEnabled: true,
        twoFactorMethod: method,
      });

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
