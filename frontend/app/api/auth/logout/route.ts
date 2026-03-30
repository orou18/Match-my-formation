import { NextResponse } from "next/server";
import { buildUrl } from "@/lib/config/api";

export async function POST(request: Request) {
  let status = 200;

  try {
    const authorization = request.headers.get("authorization");

    const response = await fetch(buildUrl("/api/auth/logout"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: "no-store",
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

  return nextResponse;
}
