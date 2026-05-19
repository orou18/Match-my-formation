import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

async function proxy(request: NextRequest, method: "POST" | "PUT" | "DELETE") {
  const body = await request.json();
  const response = await laravelFetch("/api/creator/media/batch", {
    request,
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function POST(request: NextRequest) {
  return proxy(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxy(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return proxy(request, "DELETE");
}
