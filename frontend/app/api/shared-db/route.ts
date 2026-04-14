import { NextRequest, NextResponse } from "next/server";
import { fetchPublicVideosPayload } from "@/lib/api/public-videos-proxy";

export async function GET(request: NextRequest) {
  try {
    const { response, body } = await fetchPublicVideosPayload();
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error("SHARED DB - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
