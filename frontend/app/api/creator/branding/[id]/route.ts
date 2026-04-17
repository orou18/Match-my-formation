import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token manquant ou invalide" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    
    // Appeler l'API backend Laravel pour récupérer le branding du créateur
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const apiUrl = `${backendUrl}/api/creator/${params.id}/branding`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || "Erreur lors de la récupération du branding" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Branding API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
