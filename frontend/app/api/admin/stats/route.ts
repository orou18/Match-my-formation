import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/admin/stats", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques admin:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Backend indisponible",
      },
      { status: 502 }
    );
  }
}
