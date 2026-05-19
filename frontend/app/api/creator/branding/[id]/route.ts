import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await laravelFetch(`/api/creator/${id}/branding`, {
    request,
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}
