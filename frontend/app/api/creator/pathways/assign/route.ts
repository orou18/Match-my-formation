import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await laravelFetch("/api/creator/pathways/assign", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Assign Pathway Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'assignation du parcours" },
      { status: 500 }
    );
  }
}
