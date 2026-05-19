import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/creator/dashboard", { request });
  const data = await parseLaravelJson(response);

  if (!response.ok) {
    return NextResponse.json(data ?? {}, { status: response.status });
  }

  const overview = data?.overview || {};
  const recentVideos = Array.isArray(data?.recentVideos)
    ? data.recentVideos
    : [];

  return NextResponse.json(
    {
      ...data,
      success: true,
      videos: recentVideos,
      stats: {
        totalVideos: overview.totalVideos || 0,
        totalViews: overview.totalViews || 0,
        engagement: overview.engagementRate || 0,
        revenue: overview.totalRevenue || 0,
      },
      data: {
        totalVideos: overview.totalVideos || 0,
        totalEmployees: overview.totalSubscribers || 0,
        totalViews: overview.totalViews || 0,
        totalRevenue: overview.totalRevenue || 0,
        monthlyGrowth: overview.monthlyGrowth || {},
        recentVideos,
        recentActivity: recentVideos.map((video: any) => ({
          id: video.id,
          type: "video_created",
          message: `Nouvelle vidéo "${video.title}" ajoutée`,
          created_at: video.created_at,
        })),
      },
    },
    { status: response.status }
  );
}
