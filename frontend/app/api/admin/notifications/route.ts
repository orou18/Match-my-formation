import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/admin/notifications", {
    request,
    searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await laravelFetch("/api/admin/notifications", {
    request,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const { id, ...body } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID notification requis" }, { status: 400 });
  }

  const response = await laravelFetch(`/api/admin/notifications/${id}`, {
    request,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID notification requis" }, { status: 400 });
  }

  const response = await laravelFetch(`/api/admin/notifications/${id}`, {
    request,
    method: "DELETE",
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}
