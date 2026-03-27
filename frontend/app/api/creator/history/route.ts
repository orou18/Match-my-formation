import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { getCreatorHistory } from "@/lib/server/creator-store";

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
      history: getCreatorHistory(creatorId),
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
