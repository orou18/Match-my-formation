import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorMedia,
  saveCreatorMedia,
} from "@/lib/server/creator-experience-store";

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
    return NextResponse.json({ items: getCreatorMedia(creatorId) });
  } catch (error) {
    console.error("Creator media API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const items = getCreatorMedia(creatorId);
    const next = items.map((item) =>
      item.id === String(body.id)
        ? { ...item, isFavorite: body.isFavorite ?? !item.isFavorite }
        : item
    );
    saveCreatorMedia(next);
    return NextResponse.json({ items: next });
  } catch (error) {
    console.error("Creator media update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
