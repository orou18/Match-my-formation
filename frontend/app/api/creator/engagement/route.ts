import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { getCreatorEngagementAnalytics } from "@/lib/server/creator-experience-store";

type SessionUser = { id?: string | number; role?: string };

async function resolveCreatorId(request: NextRequest) {
  const tokenId = getUserIdFromToken(request);
  if (tokenId) return String(tokenId);
  const session = await getServerSession(authOptions);
  const user = (session?.user as SessionUser | undefined) || {};
  return user.id ? String(user.id) : "2";
}

export async function GET(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    return NextResponse.json({
      data: getCreatorEngagementAnalytics(creatorId),
    });
  } catch (error) {
    console.error("Creator engagement API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
