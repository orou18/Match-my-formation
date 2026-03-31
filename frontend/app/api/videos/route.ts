import { NextRequest, NextResponse } from "next/server";
import { fetchPublicVideosPayload } from "@/lib/api/public-videos-proxy";

export async function GET(request: NextRequest) {
  try {
    const { response, body } = await fetchPublicVideosPayload();
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error("VIDEOS PUBLIC - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "refresh") {
      const { response, body } = await fetchPublicVideosPayload();
      return NextResponse.json(
        { ...body, refreshed: true },
        { status: response.status }
      );
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
