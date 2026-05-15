import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Transférer tous les paramètres au backend Laravel
    const url = `/api/videos/all-public?${searchParams.toString()}`;
    
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos publiques:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      timestamp: new Date().toISOString(),
    }, { status: 502 });
  }
}
