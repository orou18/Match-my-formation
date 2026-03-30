import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import {
  findAccountById,
  updateAccount,
  updateUserSecurity,
} from "@/lib/server/account-store";

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

    const { currentPassword, newPassword } = await request.json();

    // Validation basique
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    const account = findAccountById(String(finalUserId));
    if (!account || account.password !== currentPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    updateAccount(String(finalUserId), { password: newPassword });
    updateUserSecurity(String(finalUserId), {
      lastPasswordChange: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
