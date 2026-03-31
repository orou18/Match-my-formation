import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchBackend("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => null);
    const nextResponse = NextResponse.json(payload, { status: response.status });

    if (response.ok && payload?.user?.id) {
      nextResponse.cookies.set("userId", String(payload.user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (response.ok && payload?.user?.role) {
      nextResponse.cookies.set("userRole", String(payload.user.role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (response.ok && payload?.token) {
      nextResponse.cookies.set("authToken", String(payload.token), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Erreur proxy login:", error);
    return NextResponse.json(
      {
        message:
          "Impossible de joindre le backend d'authentification. Vérifie que Laravel tourne sur 127.0.0.1:8000, localhost:8000, 127.0.0.1:8001 ou localhost:8001.",
      },
      { status: 502 }
    );
  }
}
