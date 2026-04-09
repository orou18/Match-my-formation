import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await laravelFetch(`/api/creator/employees/${id}`, {
      request,
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement de l'employe",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await laravelFetch(`/api/creator/employees/${id}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Update employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la mise a jour de l'employe",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await laravelFetch(`/api/creator/employees/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la suppression de l'employe",
      },
      { status: 500 }
    );
  }
}
