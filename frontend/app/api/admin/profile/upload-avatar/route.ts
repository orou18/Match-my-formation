import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

/**
 * POST /api/admin/profile/upload-avatar
 * 
 * Rôle: PROXY vers Laravel API
 * Source de vérité: MySQL via Laravel
 * 
 * Avant: Utilisait account-store.ts + stockage local
 * Après: Utilise laravelFetch() → Laravel → MySQL + Storage
 */
export async function POST(request: NextRequest) {
  try {
    // Forward FormData directement à Laravel
    const formData = await request.formData();
    
    const response = await laravelFetch("/api/admin/profile/upload-avatar", {
      request,
      method: "POST",
      body: formData,
      // Ne pas définir Content-Type, laisser fetch le définir pour FormData
    });
    
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error("[PROFILE API] Erreur upload-avatar:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}