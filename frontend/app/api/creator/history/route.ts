import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/history", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(
      Array.isArray(data) ? { history: data } : data,
      { status: response.status }
    );
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
