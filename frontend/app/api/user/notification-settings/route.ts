import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Récupérer les paramètres de notification
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Mock settings - Remplacer par appel à votre base de données
    const settings = {
      courseAlerts: true,
      marketingEmails: false,
      directMessages: true,
      systemAnnouncements: true,
      achievementAlerts: true,
      weeklyDigest: true,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paramètres de notification:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour les paramètres de notification
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
        obj[key] = newSettings[key];
        return obj;
      }, {} as any);

    // Mock update - Remplacer par appel à votre base de données
    console.log(
      "Mise à jour des paramètres de notification:",
      filteredSettings
    );

    return NextResponse.json({
      message: "Paramètres mis à jour avec succès",
      ...filteredSettings,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des paramètres de notification:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
