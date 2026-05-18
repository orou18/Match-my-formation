import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";
    
    // Transférer les paramètres au backend Laravel
    const url = `/api/creator/engagement?period=${period}`;
    
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR ENGAGEMENT - Erreur:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}
