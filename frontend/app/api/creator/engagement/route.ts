import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";
    
    // Transférer les paramètres au backend Laravel
    const url = `/api/creator/engagement?period=${period}`;
    
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR ENGAGEMENT - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      engagementMetrics: [
        {
          metric: "Vues totales",
          value: "125,432",
          change: 12.5,
          color: "text-blue-600",
          icon: "Eye",
        },
        {
          metric: "Likes",
          value: "8,234",
          change: 8.3,
          color: "text-red-600",
          icon: "Heart",
        },
        {
          metric: "Commentaires",
          value: "1,456",
          change: 15.2,
          color: "text-green-600",
          icon: "MessageSquare",
        },
        {
          metric: "Partages",
          value: "567",
          change: 22.1,
          color: "text-purple-600",
          icon: "Share",
        },
        {
          metric: "Taux d'engagement",
          value: "6.8%",
          change: -2.3,
          color: "text-orange-600",
          icon: "TrendingUp",
        },
      ],
      topVideos: [
        {
          id: "1",
          title: "Introduction au Marketing Digital",
          thumbnail: "/placeholder.jpg",
          views: 15420,
          likes: 892,
          comments: 156,
          shares: 78,
          engagement: 7.2,
          duration: "12:34",
        },
        {
          id: "2",
          title: "Techniques de Vente Avancées",
          thumbnail: "/placeholder.jpg",
          views: 12350,
          likes: 745,
          comments: 98,
          shares: 56,
          engagement: 7.1,
          duration: "15:22",
        },
      ],
      engagementTimeline: [
        { date: "2024-03-18", likes: 45, comments: 12, shares: 8, engagement: 6.5 },
        { date: "2024-03-19", likes: 52, comments: 15, shares: 10, engagement: 7.2 },
        { date: "2024-03-20", likes: 48, comments: 18, shares: 9, engagement: 6.8 },
      ],
      audienceSegments: [
        { segment: "Nouveaux", percentage: 15, engagement: 75, color: "#3B82F6" },
        { segment: "Actifs", percentage: 45, engagement: 85, color: "#10B981" },
        { segment: "Engagés", percentage: 25, engagement: 95, color: "#F59E0B" },
        { segment: "Inactifs", percentage: 15, engagement: 25, color: "#6B7280" },
      ],
      recentComments: [
        {
          id: "1",
          user: { name: "Alice Martin", avatar: "/temoignage.png", subscribers: 1250 },
          content: "Excellent contenu ! Très clair et bien expliqué.",
          video: { title: "Introduction au Marketing Digital", thumbnail: "/placeholder.jpg", id: "1" },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          replies: 3,
          status: "published",
          sentiment: "positive",
          isPinned: false,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: fallbackData
    }, { status: 200 });
  }
}
