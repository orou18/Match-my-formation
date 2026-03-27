import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorNotifications,
  saveCreatorNotifications,
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
      notifications: getCreatorNotifications(creatorId),
    });
  } catch (error) {
    console.error(
      "Erreur lors du chargement des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const notifications = getCreatorNotifications(creatorId);

    if (body.action === "mark_all_read") {
      saveCreatorNotifications(
        creatorId,
        notifications.map((notification) => ({ ...notification, read: true }))
      );
      return NextResponse.json({ success: true });
    }

    if (!body.id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    saveCreatorNotifications(
      creatorId,
      notifications.map((notification) =>
        notification.id === String(body.id)
          ? { ...notification, read: body.read ?? true }
          : notification
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const notifications = getCreatorNotifications(creatorId);

    saveCreatorNotifications(
      creatorId,
      id ? notifications.filter((notification) => notification.id !== id) : []
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
