import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/engagement", { request });
    const data = await parseLaravelJson(response);
    const topVideos = data?.data?.topVideos || [];
    return NextResponse.json(
      {
        data: {
          totalShares: topVideos.reduce((sum: number, video: any) => sum + Number(video.shares || 0), 0),
          topSharedVideos: topVideos,
        },
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Creator shares API error:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}
