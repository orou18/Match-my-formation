import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/engagement", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(
      { comments: data?.data?.recentComments || [] },
      { status: response.status }
    );
  } catch (error) {
    console.error("Creator comments API error:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "La modération des commentaires doit passer par Laravel." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "La suppression des commentaires doit passer par Laravel." },
    { status: 405 }
  );
}
