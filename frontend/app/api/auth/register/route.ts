import { NextRequest, NextResponse } from "next/server";
import { buildUrl } from "@/lib/config/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(buildUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);
    const nextResponse = NextResponse.json(payload, { status: response.status });

    if (response.ok && payload?.user?.id) {
      nextResponse.cookies.set("userId", String(payload.user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (response.ok && payload?.user?.role) {
      nextResponse.cookies.set("userRole", String(payload.user.role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Erreur proxy register:", error);
    return NextResponse.json(
      {
        message:
          "Impossible de joindre le backend d'inscription. Vérifie NEXT_PUBLIC_API_URL et le serveur Laravel.",
      },
      { status: 502 }
    );
  }
}
