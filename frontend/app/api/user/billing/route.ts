import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import { getProfile, getUserBilling } from "@/lib/server/account-store";

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
    const records = getUserBilling(String(finalUserId));

    return NextResponse.json({
      subscription: profile?.subscription || "FREE",
      paymentMethod: {
        brand: "VISA",
        maskedNumber: "4242",
        expiresAt: "12/27",
      },
      transactions: records,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
