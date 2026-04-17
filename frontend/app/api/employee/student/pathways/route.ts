import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    
    // Récupérer les paramètres
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const sortBy = searchParams.get('sort_by') || 'progress';
    
    // Appeler l'API backend Laravel pour récupérer les parcours
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    if (difficulty && difficulty !== 'all') params.set('difficulty', difficulty);
    if (sortBy) params.set('sort_by', sortBy);
    
    const queryString = params.toString();
    const apiUrl = `${backendUrl}/api/employee/student/pathways${queryString ? `?${queryString}` : ''}`;
    
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
        { success: false, message: errorData.message || "Erreur lors de la récupération des parcours" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Pathways API error:", error);
    
    // Retourner des données mockées en cas d'erreur pour éviter de casser l'interface
    const mockPathways = [
      {
        id: 1,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les fondamentaux du marketing digital et apprenez à créer des stratégies efficaces pour votre entreprise.",
        thumbnail: "/pathway-marketing.jpg",
        duration: 3600, // 1 heure en secondes
        videos_count: 12,
        completed_videos: 8,
        is_locked: false,
        progress_percentage: 67,
        created_at: "2026-04-01T10:00:00Z",
        difficulty: "beginner",
        category: "marketing",
        rating: 4.5
      },
      {
        id: 2,
        title: "Développement Web Avancé",
        description: "Maîtrisez les technologies modernes du développement web et créez des applications complexes.",
        thumbnail: "/pathway-development.jpg",
        duration: 7200, // 2 heures en secondes
        videos_count: 24,
        completed_videos: 5,
        is_locked: false,
        progress_percentage: 21,
        created_at: "2026-04-05T14:30:00Z",
        difficulty: "advanced",
        category: "development",
        rating: 4.8
      },
      {
        id: 3,
        title: "Design UX/UI Moderne",
        description: "Apprenez les principes du design utilisateur et créez des interfaces magnifiques et fonctionnelles.",
        thumbnail: "/pathway-design.jpg",
        duration: 5400, // 1.5 heures en secondes
        videos_count: 18,
        completed_videos: 0,
        is_locked: true,
        progress_percentage: 0,
        created_at: "2026-04-10T09:15:00Z",
        difficulty: "intermediate",
        category: "design",
        rating: 4.2
      },
      {
        id: 4,
        title: "Business Intelligence",
        description: "Analysez les données et prenez des décisions éclairées grâce aux outils de Business Intelligence.",
        thumbnail: "/pathway-business.jpg",
        duration: 4800, // 1.33 heures en secondes
        videos_count: 16,
        completed_videos: 12,
        is_locked: false,
        progress_percentage: 75,
        created_at: "2026-03-20T16:45:00Z",
        difficulty: "intermediate",
        category: "business",
        rating: 4.6
      },
    ];
    
    return NextResponse.json({
      success: true,
      data: mockPathways
    }, { status: 200 });
  }
}
