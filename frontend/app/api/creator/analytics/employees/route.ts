import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const response = await laravelFetch("/api/creator/analytics/employees", {
    request,
    searchParams: {
      department: params.get("department"),
      date_range: params.get("dateRange") || "30d",
      sort_by: params.get("sortBy") || "progress",
      page: params.get("page") || "1",
      limit: params.get("limit") || "10",
    },
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}
