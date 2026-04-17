import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers ou cookies
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token manquant ou invalide" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sort_by');
    const sortOrder = searchParams.get('sort_order');
    const perPage = searchParams.get('per_page');
    
    // Construire l'URL de l'API backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    if (sortBy) params.set('sort_by', sortBy);
    if (sortOrder) params.set('sort_order', sortOrder);
    if (perPage) params.set('per_page', perPage);
    
    const queryString = params.toString();
    const apiUrl = `${backendUrl}/api/employee/student/videos${queryString ? `?${queryString}` : ''}`;
    
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
        { success: false, message: errorData.message || "Erreur d'authentification" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Videos API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
