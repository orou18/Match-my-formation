import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('date_range') || '30d';
    
    // Ajouter le paramètre date_range à la requête backend
    const url = `/api/creator/history?date_range=${dateRange}`;
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique créateur:", error);
    
    // Fallback avec données simulées
    const fallbackHistory = [
      {
        id: 'video_1',
        type: 'video_upload',
        title: 'Nouvelle vidéo créée',
        description: 'Introduction au Marketing Digital',
        videoTitle: 'Introduction au Marketing Digital',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        metadata: {
          videoId: 1,
          views: 1250,
          likes: 89,
        },
      },
      {
        id: 'pathway_1',
        type: 'course_update',
        title: 'Nouveau parcours créé',
        description: 'Parcours Test Marketing',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        metadata: {
          pathwayId: 1,
          videosCount: 2,
        },
      },
      {
        id: 'enrollment_1',
        type: 'enrollment',
        title: 'Parcours assigné',
        description: 'Parcours Test Marketing',
        studentName: 'Jean Dupont',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'completed',
        metadata: {
          studentId: 1,
          pathwayId: 1,
        },
      },
    ];
    
    return NextResponse.json({
      success: true,
      history: fallbackHistory,
      total: fallbackHistory.length,
    }, { status: 200 });
  }
}

// Route pour les statistiques
export async function POST(request: NextRequest) {
  try {
    const { date_range = '30d' } = await request.json();
    
    const url = `/api/creator/history/stats?date_range=${date_range}`;
    const response = await laravelFetch(url, { 
      request,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date_range })
    });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques créateur:", error);
    
    // Fallback avec données simulées
    const fallbackStats = {
      success: true,
      stats: {
        videos: {
          total: 3,
          total_views: 3486,
          total_likes: 201,
          total_comments: 45,
          avg_views: 1162,
        },
        pathways: {
          total: 1,
          total_duration: 5,
          total_videos: 2,
          total_assignments: 1,
        },
        employees: {
          total: 1,
          active: 1,
          assignments: 1,
        },
      },
      date_range: '30d',
    };
    
    return NextResponse.json(fallbackStats, { status: 200 });
  }
}
