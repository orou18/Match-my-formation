import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getUserNotificationSettings,
  updateUserNotificationSettings,
} from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return NextResponse.json(getUserNotificationSettings(String(finalUserId)));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paramètres de notification:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const newSettings = await request.json();

    // Validation basique
    const allowedFields = [
      "courseAlerts",
      "marketingEmails",
      "directMessages",
      "systemAnnouncements",
      "achievementAlerts",
      "weeklyDigest",
    ];
    const filteredSettings = Object.keys(newSettings)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = newSettings[key] as boolean;
        return obj;
      }, {} as Record<string, boolean>);

    const nextSettings = updateUserNotificationSettings(
      String(finalUserId),
      filteredSettings
    );

    return NextResponse.json({
      message: "Paramètres mis à jour avec succès",
      ...nextSettings,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des paramètres de notification:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
