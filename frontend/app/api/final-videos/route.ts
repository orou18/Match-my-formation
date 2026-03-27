import { NextRequest, NextResponse } from "next/server";
import { SharedVideoData } from "@/lib/shared-video-data";

export async function GET(request: NextRequest) {
  try {
    console.log("FINAL VIDEOS - Récupération des vidéos publiques");

    // Récupérer les vidéos publiques depuis le module partagé
    const publicVideos = SharedVideoData.getPublicVideos();

    console.log("FINAL VIDEOS - Vidéos trouvées:", publicVideos.length);
    console.log(
      "FINAL VIDEOS - Titres:",
      publicVideos.map((v) => v.title)
    );

    return NextResponse.json({
      videos: publicVideos,
      total: publicVideos.length,
    });
  } catch (error) {
    console.error("FINAL VIDEOS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, video } = await request.json();

    if (action === "add") {
      console.log("FINAL VIDEOS - Ajout vidéo:", video.title);

      // Ajouter la vidéo au module partagé
      SharedVideoData.addVideo(video);

      return NextResponse.json({
        success: true,
        message: "Vidéo ajoutée avec succès",
        video: video,
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("FINAL VIDEOS - Erreur POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
