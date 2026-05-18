import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('date_range') || '30d';
    
    // Ajouter le paramètre date_range à la requête backend
    const url = `/api/creator/history?date_range=${dateRange}`;
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique créateur:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}

// Route pour les statistiques
export async function POST(request: NextRequest) {
  try {
    const { date_range = '30d' } = await request.json();
    
    const url = `/api/creator/history/stats?date_range=${date_range}`;
    const response = await laravelFetch(url, { 
      request,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date_range })
    });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques créateur:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}
