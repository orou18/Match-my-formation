import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorComments,
  saveCreatorComments,
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
    return NextResponse.json({ comments: getCreatorComments(creatorId) });
  } catch (error) {
    console.error("Creator comments API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const comments = getCreatorComments(creatorId);
    const next = comments.map((comment) =>
      comment.id === String(body.id)
        ? {
            ...comment,
            status: body.status ?? comment.status,
            likes: body.action === "like" ? comment.likes + 1 : comment.likes,
          }
        : comment
    );
    saveCreatorComments(next);
    return NextResponse.json({ comments: next });
  } catch (error) {
    console.error("Creator comments update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const comments = getCreatorComments(creatorId);
    const next = comments.map((comment) =>
      comment.id === id ? { ...comment, status: "deleted" as const } : comment
    );
    saveCreatorComments(next);
    return NextResponse.json({ comments: next });
  } catch (error) {
    console.error("Creator comments delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
