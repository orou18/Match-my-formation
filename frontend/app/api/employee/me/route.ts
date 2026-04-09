import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/me", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Employee me proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement du profil employe",
      },
      { status: 500 }
    );
  }
}
