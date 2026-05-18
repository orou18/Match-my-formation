import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/videos/public", { request });
    const data = await parseLaravelJson(response);
    const videos = Array.isArray(data?.videos) ? data.videos : [];

    return NextResponse.json(
      { videos, total: videos.length },
      { status: response.status }
    );
  } catch (error) {
    console.error("STUDENT VIDEOS - Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        videos: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Cette route legacy est en lecture seule." },
    { status: 405 }
  );
}
