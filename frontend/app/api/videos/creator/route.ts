import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

export async function GET() {
  try {
    const response = await fetchBackend("/api/videos/public", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await response.json();
    const videos = Array.isArray(payload)
      ? payload
      : payload.videos || payload.data || [];

    return NextResponse.json({
      success: true,
      data: videos,
      count: videos.length,
      message: "Vidéos créateurs récupérées avec succès",
    }, { status: response.status });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos créateurs:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        data: [],
        count: 0,
        message: "Erreur lors de la récupération des vidéos créateurs",
      },
      { status: 500 }
    );
  }
}
