import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { findAccountById, updateAccount, updateUserSecurity } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
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

    const account = findAccountById(String(sessionUser.id));
    if (!account || account.password !== currentPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    updateAccount(account.id, { password: newPassword });
    updateUserSecurity(account.id, { lastPasswordChange: new Date().toISOString() });

    return NextResponse.json({
      message: "Mot de passe modifié avec succès",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ADMIN PROFILE - Erreur changement mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
