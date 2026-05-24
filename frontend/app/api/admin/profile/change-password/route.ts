import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

/**
 * POST /api/admin/profile/change-password
 * 
 * Rôle: PROXY vers Laravel API
 * Source de vérité: MySQL via Laravel
 * 
 * Avant: Utilisait account-store.ts (JSON local)
 * Après: Utilise laravelFetch() → Laravel → MySQL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await laravelFetch("/api/admin/profile/change-password", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("[PROFILE API] Erreur change-password:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}