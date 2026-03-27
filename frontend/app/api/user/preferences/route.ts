import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getUserPreferences,
  updateUserPreferences,
} from "@/lib/server/account-store";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      preferences: getUserPreferences(userId),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;
    if (!preferences) {
      return NextResponse.json(
        { error: "Préférences manquantes" },
        { status: 400 }
      );
    }
    const nextPreferences = updateUserPreferences(userId, preferences);

    return NextResponse.json({
      success: true,
      message: "Préférences sauvegardées avec succès",
      preferences: nextPreferences,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des préférences:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
