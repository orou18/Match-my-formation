import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const body = await request.json();
    
    // Mettre à jour la progression de la vidéo
    const response = await laravelFetch(`/api/employee/progress/video/${videoId}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE VIDEO PROGRESS - Erreur:", error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la mise à jour de la progression vidéo"
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    
    // Marquer la vidéo comme terminée
    const response = await laravelFetch(`/api/employee/progress/video/${videoId}/complete`, {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE VIDEO COMPLETE - Erreur:", error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur lors du marquage de la vidéo comme terminée"
    }, { status: 500 });
  }
}
