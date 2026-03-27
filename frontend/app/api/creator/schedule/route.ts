import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorSchedule,
  saveCreatorSchedule,
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
    return NextResponse.json({ items: getCreatorSchedule(creatorId) });
  } catch (error) {
    console.error("Creator schedule API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const items = getCreatorSchedule(creatorId);
    const next = items.map((item) =>
      item.id === String(body.id) ? { ...item, ...body } : item
    );
    saveCreatorSchedule(next);
    return NextResponse.json({ items: next });
  } catch (error) {
    console.error("Creator schedule update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
