import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/pathways", { request });
    const data = await parseLaravelJson(response);
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
