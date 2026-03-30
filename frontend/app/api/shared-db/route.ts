import { NextRequest, NextResponse } from "next/server";
import { SharedDB } from "@/lib/server/shared-db";

export async function GET(request: NextRequest) {
  try {
    console.log("SHARED DB - Récupération des vidéos");

    return NextResponse.json({
      videos: SharedDB.getVideos(),
      total: SharedDB.getVideos().length,
    });
  } catch (error) {
    console.error("SHARED DB - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
