import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getRoleFromToken, getUserIdFromToken } from "@/lib/auth";
import {
  findAccountById,
  getUserNotifications,
  saveUserNotifications,
} from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;
    const role =
      getRoleFromToken(request) ||
      (session?.user as SessionUser | undefined)?.role ||
      "student";

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const account = findAccountById(String(finalUserId));
    return NextResponse.json(
      getUserNotifications(
        String(finalUserId),
        (account?.role || role) as
          | "student"
          | "creator"
          | "admin"
          | "super_admin"
          | "employee"
      )
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;
    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const account = findAccountById(String(finalUserId));
    const notifications = getUserNotifications(
      String(finalUserId),
      (account?.role || "student") as
        | "student"
        | "creator"
        | "admin"
        | "super_admin"
        | "employee"
    );

    if (body.action === "mark_all_read") {
      return NextResponse.json(
        saveUserNotifications(
          String(finalUserId),
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        )
      );
    }

    if (!body.id) {
      return NextResponse.json(
        { error: "ID notification requis" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      saveUserNotifications(
        String(finalUserId),
        notifications.map((notification) =>
          notification.id === String(body.id)
            ? { ...notification, isRead: body.isRead ?? true }
            : notification
        )
      )
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;
    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");
    const notifications = getUserNotifications(String(finalUserId), "student");

    if (!notificationId) {
      return NextResponse.json(saveUserNotifications(String(finalUserId), []));
    }

    return NextResponse.json(
      saveUserNotifications(
        String(finalUserId),
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      )
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
