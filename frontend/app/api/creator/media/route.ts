import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/videos", { request });
    const data = await parseLaravelJson(response);
    const videos = Array.isArray(data) ? data : data?.videos || data?.data || [];
    return NextResponse.json({
      items: videos.map((video: any) => ({
        id: String(video.id),
        name: video.title,
        type: "video",
        url: video.video_url || video.url,
        thumbnail: video.thumbnail || video.thumbnail_url,
        size: "",
        duration: video.duration,
        format: video.source_type || "video",
        createdAt: video.created_at,
        tags: Array.isArray(video.tags) ? video.tags : [],
        description: video.description || "",
        isFavorite: false,
        metadata: {},
      })),
    }, { status: response.status });
  } catch (error) {
    console.error("Creator media API error:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Favoris médias non disponibles sans table persistante." },
    { status: 405 }
  );
}
