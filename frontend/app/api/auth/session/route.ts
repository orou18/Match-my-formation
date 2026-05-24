import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * API Route /api/auth/session
 * 
 * Retourne la session NextAuth courante.
 * SOURCE DE VÉRITÉ : session NextAuth (et non localStorage)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        user: null,
        expires: null,
      });
    }

    // Vérifier que l'ID est présent
    if (!session.user.id) {
      console.warn("[/api/auth/session] User ID missing in session");
      return NextResponse.json({
        user: null,
        expires: null,
      });
    }

    return NextResponse.json({
      user: session.user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Erreur /api/auth/session:", error);
    return NextResponse.json({
      user: null,
      expires: null,
    });
  }
}
