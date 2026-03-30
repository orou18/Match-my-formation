import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorSettings,
  updateCreatorSettings,
} from "@/lib/server/creator-store";

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
      settings: getCreatorSettings(creatorId),
    });
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la personnalisation créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    return NextResponse.json({
      settings: updateCreatorSettings(creatorId, body),
      message: "Paramètres du dashboard sauvegardés",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde de la personnalisation créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
