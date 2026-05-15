import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Transférer tous les paramètres au backend
    const url = `/api/admin/creators?${searchParams.toString()}`;
    
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Backend admin créateurs indisponible" },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await laravelFetch("/api/admin/creators", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur création:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du créateur" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const response = await laravelFetch(`/api/admin/creators/${id}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du créateur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    const response = await laravelFetch(`/api/admin/creators/${id}`, {
      request,
      method: "DELETE",
    });
    
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du créateur" },
      { status: 500 }
    );
  }
}
