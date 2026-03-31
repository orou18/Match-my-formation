import { NextRequest, NextResponse } from "next/server";
import { parseLaravelJson } from "@/lib/api/laravel-proxy";
import {
  fetchBackendWithRequestAuth,
  getRequestAccessToken,
} from "@/lib/api/request-backend";

export async function GET(request: NextRequest) {
  try {
    if (!getRequestAccessToken(request)) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const response = await fetchBackendWithRequestAuth(request, "/api/me");
    const payload = await parseLaravelJson(response);

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Erreur proxy /api/me:", error);
    return NextResponse.json(
      { message: "Impossible de charger l'utilisateur courant." },
      { status: 500 }
    );
  }
}
