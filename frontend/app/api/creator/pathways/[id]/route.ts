import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await laravelFetch(`/api/creator/pathways/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete Pathway Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression du parcours" },
      { status: 500 }
    );
  }
}
