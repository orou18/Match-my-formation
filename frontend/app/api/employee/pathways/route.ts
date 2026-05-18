import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/pathways", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE PATHWAYS - Erreur:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathwayId } = body;
    
    if (!pathwayId) {
      return NextResponse.json(
        { error: "ID du pathway requis" },
        { status: 400 }
      );
    }

    // Démarrer un pathway
    const response = await laravelFetch(`/api/employee/pathways/${pathwayId}/start`, {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE PATHWAYS - Erreur démarrage:", error);
    return NextResponse.json(
      { error: "Erreur lors du démarrage du parcours" },
      { status: 500 }
    );
  }
}
