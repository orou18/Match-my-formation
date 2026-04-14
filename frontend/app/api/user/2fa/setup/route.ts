import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
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
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { method } = await request.json();

    // Validation
    if (!method || !["email", "sms", "app"].includes(method)) {
      return NextResponse.json({ error: "Méthode invalide" }, { status: 400 });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationHash = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");
    updateUserSecurity(String(finalUserId), {
      twoFactorMethod: method,
    });

    const response = NextResponse.json({
      message: `Code de vérification envoyé par ${method}`,
      success: true,
      method: method,
    });

    response.cookies.set("twoFactorCodeHash", verificationHash, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });
    response.cookies.set("twoFactorMethod", method, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    if (process.env.NODE_ENV === "development") {
      response.headers.set("x-dev-2fa-code", verificationCode);
    }

    return response;
  } catch (error) {
    console.error("Erreur lors de la configuration 2FA:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
