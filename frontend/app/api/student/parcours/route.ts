import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  const response = await laravelFetch("/api/student/parcours", {
    request,
    searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "L'inscription à un parcours doit passer par un endpoint Laravel persistant dédié.",
    },
    { status: 405 }
  );
}
