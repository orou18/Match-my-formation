import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/videos", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(
      Array.isArray(data) ? { videos: data } : data,
      { status: response.status }
    );
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await laravelFetch("/api/creator/videos", {
      request,
      method: "POST",
      body: formData,
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const response = await laravelFetch(`/api/creator/videos/${id}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const response = await laravelFetch(`/api/creator/videos/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
