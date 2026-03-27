import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const metric = searchParams.get("metric") || "revenue";

    const backendResponse = await laravelFetch("/api/admin/stats", { request });
    const payload = await parseLaravelJson(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error:
            payload?.message ||
            payload?.error ||
            "Impossible de charger les analytics admin",
        },
        { status: backendResponse.status }
      );
    }

    const totalUsers = Number(payload?.totalUsers || 0);
    const totalCourses = Number(payload?.totalCourses || 0);
    const totalVideos = Number(payload?.totalVideos || 0);

    return NextResponse.json({
      overview: {
        totalUsers,
        totalCreators: totalVideos,
        totalRevenue: 0,
        totalCourses,
        engagementRate: 0,
        completionRate: 0,
        monthlyGrowth: {
          users: 0,
          creators: 0,
          revenue: 0,
          courses: 0,
          engagement: 0,
          completion: 0,
        },
      },
      timeSeries: [],
      topPerformers: [],
      categories: [],
      activityHeatmap: [],
      recentActivity: Array.isArray(payload?.recentActivity)
        ? payload.recentActivity
        : [],
      period,
      metric,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { action } = await request.json().catch(() => ({ action: null }));

  if (action === "refresh") {
    return GET(request);
  }

  return NextResponse.json(
    { error: "Action non supportée côté backend pour le moment" },
    { status: 501 }
  );
}
