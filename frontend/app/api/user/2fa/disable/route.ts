import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import { updateUserSecurity } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
};

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    updateUserSecurity(String(finalUserId), {
      twoFactorEnabled: false,
    });

    return NextResponse.json({
      message: "2FA désactivé avec succès",
      twoFactorEnabled: false,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
