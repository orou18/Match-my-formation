import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

/**
 * GET /api/admin/profile
 * 
 * Rôle: PROXY vers Laravel API
 * Source de vérité: MySQL via Laravel
 * 
 * Avant: Utilisait account-store.ts (JSON local)
 * Après: Utilise laravelFetch() → Laravel → MySQL
 */
export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/admin/profile", {
      request,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    });
    
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("[PROFILE API] Erreur GET:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/profile
 * 
 * Rôle: PROXY vers Laravel API
 * Source de vérité: MySQL via Laravel
 * 
 * Avant: Utilisait account-store.ts (JSON local)
 * Après: Utilise laravelFetch() → Laravel → MySQL
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await laravelFetch("/api/admin/profile", {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("[PROFILE API] Erreur PUT:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}