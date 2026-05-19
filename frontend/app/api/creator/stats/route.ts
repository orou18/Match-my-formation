import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") || "7d";
  const response = await laravelFetch("/api/creator/stats", {
    request,
    searchParams: { range },
  });
  const data = await parseLaravelJson(response);

  if (!response.ok) {
    return NextResponse.json(data ?? {}, { status: response.status });
  }

  const overview = data?.overview || {};
  const performance = data?.performance || {};
  const topVideos = Array.isArray(data?.topVideos) ? data.topVideos : [];

  return NextResponse.json({
    ...data,
    success: true,
    data: {
      totalViews: Number(overview.totalViews || 0),
      totalStudents: Number(overview.totalSubscribers || 0),
      totalRevenue: Number(overview.totalRevenue || 0),
      totalVideos: topVideos.length,
      monthlyViews: Array.isArray(performance.views) ? performance.views : [],
      monthlyRevenue: Array.isArray(performance.revenue)
        ? performance.revenue
        : [],
      topVideos: topVideos.map((video: any) => ({
        id: String(video.id),
        title: String(video.title || "Video"),
        views: Number(video.views || 0),
        revenue: Number(video.revenue || 0),
        students: 0,
      })),
      recentActivity: [],
    },
  });
}
