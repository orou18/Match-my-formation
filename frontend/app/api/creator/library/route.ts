import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/videos", { request });
    const data = await parseLaravelJson(response);
    const videos = Array.isArray(data) ? data : data?.videos || data?.data || [];
    const items = videos.map((video: any) => ({
      id: String(video.id),
      name: video.title || "Video sans titre",
      type: "video",
      size: video.size,
      duration: video.duration,
      thumbnail: video.thumbnail || video.thumbnail_url,
      url: video.video_url || video.url,
      video_url: video.video_url || video.url,
      createdAt: video.createdAt || video.created_at,
      modifiedAt: video.updatedAt || video.updated_at || video.created_at,
      tags: Array.isArray(video.tags) ? video.tags : [],
      visibility: video.visibility === "public" ? "public" : "private",
      starred: false,
      path: `/creator/videos/${video.id}`,
    }));

    return NextResponse.json({ items }, { status: response.status });
  } catch (error) {
    console.error("Creator library API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "La bibliothèque est alimentée par les vidéos persistées." },
    { status: 405 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Modification directe de bibliothèque non disponible." },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Supprimez le contenu depuis la liste des vidéos." },
    { status: 405 }
  );
}
