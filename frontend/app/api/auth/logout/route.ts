import { NextRequest, NextResponse } from "next/server";
import { fetchBackendWithRequestAuth } from "@/lib/api/request-backend";

export async function POST(request: NextRequest) {
  let status = 200;

  try {
    const response = await fetchBackendWithRequestAuth(request, "/api/auth/logout", {
      method: "POST",
    });

    status = response.status;
  } catch (error) {
    console.error("Erreur proxy logout:", error);
    status = 502;
  }

  const nextResponse = NextResponse.json(
    { message: "Déconnexion effectuée" },
    { status }
  );

  nextResponse.cookies.set("userId", "", { maxAge: 0, path: "/" });
  nextResponse.cookies.set("userRole", "", { maxAge: 0, path: "/" });
  nextResponse.cookies.set("authToken", "", { maxAge: 0, path: "/" });

  return nextResponse;
}
