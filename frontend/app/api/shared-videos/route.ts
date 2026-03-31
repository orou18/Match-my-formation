import { NextRequest, NextResponse } from "next/server";
import { fetchPublicVideosPayload } from "@/lib/api/public-videos-proxy";

export async function GET(request: NextRequest) {
  try {
    const { response, body } = await fetchPublicVideosPayload();
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error("SHARED VIDEOS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Cette route legacy est en lecture seule." },
    { status: 405 }
  );
}
