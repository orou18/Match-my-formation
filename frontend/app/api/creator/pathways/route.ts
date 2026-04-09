import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/pathways", { request });
    const data = await parseLaravelJson(response);
    
    // Si le backend Laravel retourne 401, utiliser les parcours locaux
    if (response.status === 401) {
      // Pour le mode démo, on retourne une liste vide pour l'instant
      // Dans une vraie application, on pourrait stocker les parcours créés localement
      return NextResponse.json({
        success: true,
        data: [], // Pas de parcours en mode démo pour le GET
        message: "Mode démo - aucun parcours persistant"
      }, { status: 200 });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Pathways API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement des parcours",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await laravelFetch("/api/creator/pathways", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    
    // Si le backend Laravel retourne 401, utiliser un fallback temporaire
    if (response.status === 401) {
      // Créer un parcours avec ID temporaire
      const tempPathway = {
        id: Date.now(), // ID temporaire basé sur le timestamp
        title: body.title,
        description: body.description,
        domain: body.domain,
        duration_hours: body.duration_hours,
        difficulty_level: body.difficulty_level,
        video_ids: body.video_ids,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_temporary: true // Marquer comme temporaire
      };
      
      return NextResponse.json({
        success: true,
        data: tempPathway,
        message: "Parcours créé localement (mode démo)"
      }, { status: 200 });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Create Pathway Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du parcours",
      },
      { status: 500 }
    );
  }
}
