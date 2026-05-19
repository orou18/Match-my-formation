import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

function targetPath(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "public";

  if (type === "creator") {
    return "/api/creator/videos";
  }

  if (type === "all" || type === "admin") {
    return "/api/admin/videos";
  }

  return "/api/videos/public";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const response = await laravelFetch(targetPath(request), {
    request,
    searchParams: Object.fromEntries(searchParams.entries()),
  });
  const data = await parseLaravelJson(response);

  return NextResponse.json(data ?? {}, { status: response.status });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Cette route legacy ne persiste plus les vidéos. Utilisez /api/creator/videos ou /api/admin/videos.",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return POST();
}

export async function DELETE() {
  return POST();
}
