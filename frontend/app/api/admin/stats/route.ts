import { NextRequest, NextResponse } from "next/server";
import { readJsonStore } from "@/lib/server/json-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const metric = searchParams.get('metric') || 'all';

    // Simuler des données statistiques pour l'admin
    const stats = {
      period,
      metric,
      data: {
        // Statistiques des vidéos
        videos: {
          total: 156,
          published: 142,
          drafts: 14,
          views: 45230,
          likes: 3420,
          comments: 892,
          growth: {
            views: 12.5,
            likes: 8.3,
            comments: 15.2
          }
        },
        // Statistiques des utilisateurs
        users: {
          total: 2840,
          active: 2156,
          new: 156,
          growth: {
            total: 18.7,
            active: 12.3,
            new: 25.4
          }
        },
        // Statistiques des créateurs
        creators: {
          total: 89,
          active: 67,
          pending: 12,
          growth: {
            total: 8.9,
            active: 6.7,
            pending: -15.2
          }
        },
        // Statistiques de revenus
        revenue: {
          total: 45670,
          subscriptions: 34200,
          oneTime: 11470,
          growth: {
            total: 22.3,
            subscriptions: 18.9,
            oneTime: 35.6
          }
        },
        // Activité récente
        activity: [
          {
            id: 1,
            type: 'video',
            title: 'Nouvelle vidéo créée',
            description: 'Introduction au Marketing Digital',
            time: 'Il y a 2 heures',
            icon: 'Video',
            color: 'blue'
          },
          {
            id: 2,
            type: 'user',
            title: 'Nouvel utilisateur inscrit',
            description: 'Jean Dupont - jean.dupont@email.com',
            time: 'Il y a 3 heures',
            icon: 'User',
            color: 'green'
          },
          {
            id: 3,
            type: 'creator',
            title: 'Demande de créateur approuvée',
            description: 'Marie Martin - marie.martin@email.com',
            time: 'Il y a 5 heures',
            icon: 'User',
            color: 'purple'
          },
          {
            id: 4,
            type: 'revenue',
            title: 'Nouvel abonnement Premium',
            description: 'Pierre Durand - Abonnement mensuel',
            time: 'Il y a 6 heures',
            icon: 'DollarSign',
            color: 'green'
          }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques admin:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des statistiques" 
      },
      { status: 500 }
    );
  }
}
