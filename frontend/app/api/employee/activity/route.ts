import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/employee/activity", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("EMPLOYEE ACTIVITY - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      success: true,
      data: [
        {
          video: {
            id: 1,
            title: "Introduction au Marketing Digital",
            thumbnail: "/videos/video1-thumb.jpg",
          },
          watched_duration: 930, // 15:30 en secondes
          is_completed: true,
          last_watched_at: "2024-03-18T14:30:00Z",
          progress_percentage: 100,
        },
        {
          video: {
            id: 2,
            title: "Techniques de Vente Avancées",
            thumbnail: "/videos/video2-thumb.jpg",
          },
          watched_duration: 865, // 14:25 en secondes
          is_completed: false,
          last_watched_at: "2024-03-17T10:15:00Z",
          progress_percentage: 65,
        },
        {
          video: {
            id: 3,
            title: "Communication Efficace",
            thumbnail: "/videos/video3-thumb.jpg",
          },
          watched_duration: 420, // 7:00 en secondes
          is_completed: false,
          last_watched_at: "2024-03-16T16:45:00Z",
          progress_percentage: 30,
        },
        {
          video: {
            id: 4,
            title: "Gestion de Projet Agile",
            thumbnail: "/videos/video4-thumb.jpg",
          },
          watched_duration: 1200, // 20:00 en secondes
          is_completed: true,
          last_watched_at: "2024-03-15T09:30:00Z",
          progress_percentage: 100,
        },
        {
          video: {
            id: 5,
            title: "Leadership et Management",
            thumbnail: "/videos/video5-thumb.jpg",
          },
          watched_duration: 540, // 9:00 en secondes
          is_completed: false,
          last_watched_at: "2024-03-14T13:20:00Z",
          progress_percentage: 45,
        },
      ],
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}
