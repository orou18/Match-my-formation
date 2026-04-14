import { NextRequest, NextResponse } from "next/server";
import { fetchBackendWithRequestAuth } from "@/lib/api/request-backend";

export async function POST(request: NextRequest) {
  try {
    const response = await fetchBackendWithRequestAuth(request, "/api/me", {
      method: "GET",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.id) {
      const nextResponse = NextResponse.json(
        {
          success: false,
          message: payload?.message || "Session invalide ou expirée",
        },
        { status: response.status || 401 }
      );

      nextResponse.cookies.set("userId", "", { maxAge: 0, path: "/" });
      nextResponse.cookies.set("userRole", "", { maxAge: 0, path: "/" });
      nextResponse.cookies.set("authToken", "", { maxAge: 0, path: "/" });

      return nextResponse;
    }

    const nextResponse = NextResponse.json({
      success: true,
      user: payload,
    });

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : request.cookies.get("authToken")?.value;

    nextResponse.cookies.set("userId", String(payload.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    nextResponse.cookies.set("userRole", String(payload.role || ""), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    if (token) {
      nextResponse.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Erreur de synchronisation de session:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Impossible de synchroniser la session avec le backend",
      },
      { status: 502 }
    );
  }
}
