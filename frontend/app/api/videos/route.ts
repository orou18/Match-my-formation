import { NextRequest, NextResponse } from "next/server";
import { SharedDB } from "@/app/api/shared-db/route";

export async function GET(request: NextRequest) {
  try {
    console.log("VIDEOS PUBLIC - Récupération des vidéos publiques");

    // Récupérer les vidéos publiques depuis la base de données partagée
    const publicVideos = SharedDB.getPublicVideos();

    console.log("VIDEOS PUBLIC - Vidéos trouvées:", publicVideos.length);
    console.log(
      "VIDEOS PUBLIC - Titres:",
      publicVideos.map((v) => v.title)
    );

    return NextResponse.json({
      videos: publicVideos,
      total: publicVideos.length,
    });
  } catch (error) {
    console.error("VIDEOS PUBLIC - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, video } = await request.json();

    if (action === "refresh") {
      console.log("VIDEOS PUBLIC - Rafraîchissement manuel");
      const publicVideos = SharedDB.getPublicVideos();

      return NextResponse.json({
        videos: publicVideos,
        total: publicVideos.length,
        refreshed: true,
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("VIDEOS PUBLIC - Erreur POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
