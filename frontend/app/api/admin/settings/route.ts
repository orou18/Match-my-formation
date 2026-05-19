import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/admin/branding", { request });
  const data = await parseLaravelJson(response);

  return NextResponse.json(
    {
      settings: data ?? {},
      systemInfo: null,
      message:
        "Les paramètres système généraux nécessitent une table persistante dédiée.",
    },
    { status: response.status }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "La sauvegarde des paramètres système généraux n'est pas activée sans endpoint Laravel persistant.",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return POST();
}
