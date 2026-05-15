import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await params;

  try {
    // Récupérer les détails de la vidéo depuis le backend Laravel
    const response = await laravelFetch(`/api/videos/${videoId}`, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("VIDEO DETAILS - Erreur:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      timestamp: new Date().toISOString(),
    }, { status: 502 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const body = await request.json();
    
    // Ajouter une URL de vidéo à une vidéo existante
    const response = await laravelFetch(`/api/videos/${videoId}/add-url`, {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("VIDEO ADD URL - Erreur:", error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur lors de l'ajout de l'URL de vidéo"
    }, { status: 500 });
  }
}
