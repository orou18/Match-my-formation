import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/logout", {
      request,
      method: "POST",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Employee logout proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la deconnexion employe",
      },
      { status: 500 }
    );
  }
}
