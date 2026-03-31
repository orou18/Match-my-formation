import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

export async function GET() {
  try {
    const response = await fetchBackend("/api/videos/public", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        payload || { message: "Impossible de récupérer les vidéos publiques" },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erreur proxy vidéos publiques:", error);
    return NextResponse.json(
      { message: "Backend indisponible pour les vidéos publiques" },
      { status: 502 }
    );
  }
}
