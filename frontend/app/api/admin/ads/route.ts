import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/admin/ads", { request });
  const data = await parseLaravelJson(response);
  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await laravelFetch("/api/admin/ads", {
    request,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseLaravelJson(response);
  return NextResponse.json(data ?? {}, { status: response.status });
}
