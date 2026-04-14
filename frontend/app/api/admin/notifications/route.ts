import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  buildAdminNotification,
  getAdminNotifications,
  getNotificationStats,
  saveAdminNotifications,
} from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const notifications = getAdminNotifications();
    let filteredNotifications = notifications;

    // Filtrage
    if (type && type !== "all") {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.type === type
      );
    }
    if (status && status !== "all") {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.status === status
      );
    }
    if (search) {
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(search.toLowerCase()) ||
          notification.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      notifications: filteredNotifications,
      total: filteredNotifications.length,
      stats: getNotificationStats(notifications),
    });
  } catch (error) {
    console.error("ADMIN NOTIFICATIONS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const notificationData = await request.json();

    // Validation
    if (
      !notificationData.title ||
      !notificationData.message ||
      !notificationData.type ||
      !notificationData.target
    ) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const notifications = getAdminNotifications();
    const newNotification = buildAdminNotification(
      notificationData,
      notifications,
      (session.user as any).name || "Admin"
    );
    saveAdminNotifications([...notifications, newNotification]);

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("ADMIN NOTIFICATIONS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID notification requis" },
        { status: 400 }
      );
    }

    const notifications = getAdminNotifications();
    const notificationIndex = notifications.findIndex(
      (notification) => notification.id === id
    );

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: "Notification non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour la notification
    const updatedNotification = {
      ...notifications[notificationIndex],
      ...updateData,
    };
    notifications[notificationIndex] = updatedNotification;
    saveAdminNotifications(notifications);

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("ADMIN NOTIFICATIONS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID notification requis" },
        { status: 400 }
      );
    }

    const notifications = getAdminNotifications();
    const notificationIndex = notifications.findIndex(
      (notification) => notification.id === id
    );

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: "Notification non trouvée" },
        { status: 404 }
      );
    }

    notifications.splice(notificationIndex, 1);
    saveAdminNotifications(notifications);

    return NextResponse.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error("ADMIN NOTIFICATIONS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
