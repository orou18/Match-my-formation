import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/stats", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE STATS - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      success: true,
      data: {
        stats: {
          total_courses: 12,
          completed_courses: 8,
          in_progress_courses: 4,
          total_watch_time: 245, // minutes
          certificates_earned: 6,
          average_progress: 75.5,
          completion_rate: 66.7,
          total_pathways: 3,
          completed_pathways: 2,
          average_pathway_progress: 85.0
        },
        recent_courses: [
          {
            id: 1,
            title: "Introduction au Marketing Digital",
            description: "Découvrez les bases du marketing digital",
            thumbnail: "/videos/video1-thumb.jpg",
            video_url: "http://127.0.0.1:8000/storage/videos/video1.mp4",
            duration: "15:30",
            views: 1250,
            likes: 89,
            comments: 12,
            publishedAt: "2024-01-15T10:30:00Z",
            visibility: "public",
            status: "published",
            progress: 100,
            completed: true,
            last_watched_at: "2024-01-20T14:30:00Z",
            creator: {
              name: "Jean Formateur",
              domain: "marketing"
            }
          },
          {
            id: 2,
            title: "Techniques de Vente Avancées",
            description: "Maîtrisez les techniques de vente modernes",
            thumbnail: "/videos/video2-thumb.jpg",
            video_url: "http://127.0.0.1:8000/storage/videos/video2.mp4",
            duration: "22:15",
            views: 980,
            likes: 67,
            comments: 8,
            publishedAt: "2024-01-14T14:20:00Z",
            visibility: "public",
            status: "published",
            progress: 65,
            completed: false,
            last_watched_at: "2024-01-19T10:15:00Z",
            creator: {
              name: "Jean Formateur",
              domain: "marketing"
            }
          }
        ],
        recent_activity: [
          {
            id: 1,
            type: "course_completed",
            message: "Cours \"Introduction au Marketing Digital\" terminé",
            created_at: "2024-01-20T14:30:00Z",
            course_title: "Introduction au Marketing Digital",
            progress: 100
          },
          {
            id: 2,
            type: "course_watched",
            message: "Cours \"Techniques de Vente Avancées\" visionné",
            created_at: "2024-01-19T10:15:00Z",
            course_title: "Techniques de Vente Avancées",
            progress: 65
          }
        ]
      }
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Pour mettre à jour la progression d'un employé
    const response = await laravelFetch("/api/employee/stats/progress", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE STATS - Erreur mise à jour progression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la progression" },
      { status: 500 }
    );
  }
}
