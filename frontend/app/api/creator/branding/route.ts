import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/creator/branding", { request });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const response = await laravelFetch("/api/creator/branding", {
    request,
    method: "PUT",
    body: formData,
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}
