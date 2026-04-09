import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await laravelFetch(`/api/creator/employees/${id}/progress`, {
      request,
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get employee progress error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement de la progression de l'employe",
      },
      { status: 500 }
    );
  }
}
