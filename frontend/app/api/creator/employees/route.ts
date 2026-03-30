import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await laravelFetch("/api/creator/employees", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        domain: payload.department || payload.domain || payload.position || "general",
      }),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Add employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de l'ajout de l'employé",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/employees", { request });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get employees error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des employés",
      },
      { status: 500 }
    );
  }
}
