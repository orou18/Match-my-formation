import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await laravelFetch("/api/admin/users", {
      request,
      searchParams: Object.fromEntries(searchParams.entries()),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN USERS - Erreur:", error);
    return NextResponse.json({ error: "Backend indisponible" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await laravelFetch("/api/admin/users", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN USERS - Erreur création:", error);
    return NextResponse.json({ error: "Backend indisponible" }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });
    }

    const response = await laravelFetch(`/api/admin/users/${id}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN USERS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Backend indisponible" }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });
    }

    const response = await laravelFetch(`/api/admin/users/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN USERS - Erreur suppression:", error);
    return NextResponse.json({ error: "Backend indisponible" }, { status: 502 });
  }
}
