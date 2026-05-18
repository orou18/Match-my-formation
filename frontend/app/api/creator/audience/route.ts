import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/engagement", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(
      { data: { demographics: data?.data?.audienceSegments || [] } },
      { status: response.status }
    );
  } catch (error) {
    console.error("Creator audience API error:", error);
    return NextResponse.json({ success: false, error: "Backend indisponible" }, { status: 502 });
  }
}
