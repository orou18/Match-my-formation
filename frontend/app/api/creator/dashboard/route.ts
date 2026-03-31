import { NextRequest, NextResponse } from "next/server";
import { parseLaravelJson } from "@/lib/api/laravel-proxy";
import {
  fetchBackendWithRequestAuth,
  getRequestAccessToken,
} from "@/lib/api/request-backend";

export async function GET(request: NextRequest) {
  try {
    if (!getRequestAccessToken(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Non authentifié",
        },
        { status: 401 }
      );
    }

    const [dashboardResponse, employeeStatsResponse, employeesResponse] =
      await Promise.all([
        fetchBackendWithRequestAuth(request, "/api/creator/dashboard"),
        fetchBackendWithRequestAuth(request, "/api/creator/employees/stats"),
        fetchBackendWithRequestAuth(request, "/api/creator/employees"),
      ]);

    const [dashboardPayload, employeeStatsPayload, employeesPayload] =
      await Promise.all([
        parseLaravelJson(dashboardResponse),
        parseLaravelJson(employeeStatsResponse),
        parseLaravelJson(employeesResponse),
      ]);

    if (!dashboardResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            dashboardPayload?.message ||
            dashboardPayload?.error ||
            "Impossible de charger le dashboard créateur",
        },
        { status: dashboardResponse.status }
      );
    }

    const overview = dashboardPayload?.overview || {};
    const employees = Array.isArray(employeesPayload?.data)
      ? employeesPayload.data
      : [];
    const employeeStats = employeeStatsPayload?.data || {};
    const recentVideos = Array.isArray(dashboardPayload?.recentVideos)
      ? dashboardPayload.recentVideos
      : [];

    const data = {
      totalVideos: overview.totalVideos || 0,
      totalEmployees: employeeStats.total_employees || employees.length || 0,
      totalViews: overview.totalViews || 0,
      totalRevenue: overview.totalRevenue || 0,
      monthlyGrowth: 0,
      recentVideos: recentVideos.map((video: any) => ({
        id: Number(video.id),
        title: video.title,
        views: Number(video.views || 0),
        revenue: Number(video.revenue || (video.views || 0) * 0.01),
        created_at: video.created_at,
      })),
      topEmployees: employees
        .slice(0, 3)
        .map((employee: any, index: number) => ({
          id: Number(employee.id),
          name: employee.name,
          email: employee.email,
          completion_rate: 0,
          progress: Math.max(0, 70 - index * 10),
        })),
      recentActivity: recentVideos.slice(0, 5).map((video: any) => ({
        id: Number(video.id),
        type: "video_created",
        message: `Nouvelle vidéo "${video.title}" synchronisée depuis Laravel`,
        created_at: video.created_at,
      })),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Creator dashboard proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement du dashboard",
      },
      { status: 500 }
    );
  }
}
