import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/profile", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await laravelFetch("/api/creator/profile", {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
