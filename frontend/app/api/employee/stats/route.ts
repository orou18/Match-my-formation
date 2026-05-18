import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/stats", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE STATS - Erreur:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Pour mettre à jour la progression d'un employé
    const response = await laravelFetch("/api/employee/stats/progress", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE STATS - Erreur mise à jour progression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la progression" },
      { status: 500 }
    );
  }
}
