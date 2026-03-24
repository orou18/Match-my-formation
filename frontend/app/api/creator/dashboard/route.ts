import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data pour le dashboard creator
    const mockStats = {
      totalVideos: 24,
      totalEmployees: 156,
      totalViews: 125430,
      totalRevenue: 45678,
      monthlyGrowth: 12.5,
      recentVideos: [
        {
          id: 1,
          title: "Formation complète en hôtellerie - Module 1",
          views: 15420,
          revenue: 2340,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Techniques de service client",
          views: 12350,
          revenue: 1890,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Gestion des réservations",
          views: 9870,
          revenue: 1450,
          created_at: new Date().toISOString()
        }
      ],
      topEmployees: [
        {
          id: 1,
          name: "Marie Dubois",
          email: "marie.dubois@entreprise.com",
          completion_rate: 85,
          progress: 72
        },
        {
          id: 2,
          name: "Jean Martin",
          email: "jean.martin@entreprise.com",
          completion_rate: 92,
          progress: 88
        },
        {
          id: 3,
          name: "Sophie Bernard",
          email: "sophie.bernard@entreprise.com",
          completion_rate: 78,
          progress: 65
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: "video_created",
          message: "Nouvelle vidéo 'Formation complète en hôtellerie' publiée",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          type: "employee_assigned",
          message: "Marie Dubois a été assignée au parcours 'Hôtellerie 101'",
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          type: "milestone_reached",
          message: "Jean Martin a atteint 90% de complétion",
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockStats
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors du chargement du dashboard" 
      },
      { status: 500 }
    );
  }
}
