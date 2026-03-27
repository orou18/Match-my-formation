import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { getCreatorStats } from "@/lib/server/creator-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

async function resolveCreatorId(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (userId) return String(userId);

  const session = await getServerSession(authOptions);
  const sessionUser = (session?.user as SessionUser | undefined) || {};
  if (sessionUser.id && sessionUser.role === "creator") {
    return String(sessionUser.id);
  }

  return "2";
}

export async function GET(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    return NextResponse.json({
      success: true,
      data: getCreatorStats(creatorId),
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement des statistiques",
      },
      { status: 500 }
    );
  }
}
