import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  // DEBUG: Informations sur la requête entrante
  console.log("[ADMIN API DEBUG] === Début traitement requête ===");
  console.log("[ADMIN API DEBUG] Requête reçue");
  console.log("[ADMIN API DEBUG] Path:", request.nextUrl.pathname);
  console.log("[ADMIN API DEBUG] Method:", request.method);
  console.log("[ADMIN API DEBUG] Cookies présents:", !!request.headers.get("cookie"));
  console.log("[ADMIN API DEBUG] Authorization header entrant:", !!request.headers.get("authorization"));
  console.log("[ADMIN API DEBUG] next-auth session cookie:", request.cookies.get("next-auth.session-token")?.value ? "présent" : "absent");
  
  try {
    console.log("[ADMIN API DEBUG] Appel à laravelFetch()...");
    const response = await laravelFetch("/api/admin/stats", { request });
    
    console.log("[ADMIN API DEBUG] Réponse Laravel reçue");
    console.log("[ADMIN API DEBUG] Status:", response.status);
    console.log("[ADMIN API DEBUG] OK:", response.ok);
    
    const data = await parseLaravelJson(response);
    
    console.log("[ADMIN API DEBUG] Données parsées:", data ? "OK" : "null");
    console.log("[ADMIN API DEBUG] === Fin traitement requête ===");
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[ADMIN API DEBUG] Erreur:", error);
    if (error instanceof Error) {
      console.error("[ADMIN API DEBUG] Message:", error.message);
      console.error("[ADMIN API DEBUG] Stack:", error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        message: "Backend indisponible",
      },
      { status: 502 }
    );
  }
}
