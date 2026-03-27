import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { getProfile, getUserSecurity } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const profile = getProfile(String(finalUserId));
    const security = getUserSecurity(String(finalUserId));
    const securitySettings = {
      ...security,
      email: profile?.email || "",
      phone: security.phone || profile?.phone || "",
    };

    return NextResponse.json(securitySettings);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paramètres de sécurité:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
