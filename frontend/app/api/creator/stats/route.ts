import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data pour les statistiques
    const mockStats = {
      totalVideos: 24,
      totalViews: 125430,
      totalRevenue: 45678,
      totalEmployees: 156,
      monthlyGrowth: 12.5,
      viewsByMonth: [
        { month: "Jan", views: 15420, revenue: 5678 },
        { month: "Fév", views: 18930, revenue: 6945 },
        { month: "Mar", views: 22350, revenue: 8212 },
        { month: "Avr", views: 19870, revenue: 7301 },
        { month: "Mai", views: 25420, revenue: 9334 },
        { month: "Juin", views: 23440, revenue: 8608 }
      ],
      topVideos: [
        {
          id: 1,
          title: "Formation complète en hôtellerie",
          views: 15420,
          revenue: 5678,
          completion_rate: 78,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Techniques de service client",
          views: 12350,
          revenue: 4534,
          completion_rate: 85,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      employeeProgress: [
        {
          id: 1,
          name: "Marie Dubois",
          progress: 72,
          completion_rate: 85,
          videos_completed: 18,
          total_videos: 25
        },
        {
          id: 2,
          name: "Jean Martin",
          progress: 88,
          completion_rate: 92,
          videos_completed: 22,
          total_videos: 24
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockStats
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors du chargement des statistiques" 
      },
      { status: 500 }
    );
  }
}
