import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/admin/users", {
    request,
    searchParams: {
      ...Object.fromEntries(request.nextUrl.searchParams.entries()),
      role: "admin",
    },
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(
    {
      admins: Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data?.data)
          ? data.data
          : [],
      permissions: [],
      stats: data?.stats ?? {},
      total: data?.total ?? 0,
    },
    { status: response.status }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await laravelFetch("/api/admin/users", {
    request,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, role: body.role || "admin" }),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const { id, ...body } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID administrateur requis" }, { status: 400 });
  }

  const response = await laravelFetch(`/api/admin/users/${id}`, {
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
    return NextResponse.json({ error: "ID administrateur requis" }, { status: 400 });
  }

  const response = await laravelFetch(`/api/admin/users/${id}`, {
    request,
    method: "DELETE",
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}
