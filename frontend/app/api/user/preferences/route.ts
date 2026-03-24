import { NextRequest, NextResponse } from 'next/server';
import UserIdManager from '@/lib/user-id-manager';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!UserIdManager.isAuthenticated()) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userData = UserIdManager.getStoredUserData();
    const userId = userData?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur manquant' },
        { status: 400 }
      );
    }
    
    // Récupérer les préférences depuis la base de données ou localStorage
    // Pour l'instant, on retourne des préférences par défaut
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: false,
      newsletter: true,
      timezone: "Europe/Paris",
      language: "fr",
      theme: "light"
    };

    return NextResponse.json({
      success: true,
      preferences: defaultPreferences
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!UserIdManager.isAuthenticated()) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userData = UserIdManager.getStoredUserData();
    const userId = userData?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur manquant' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Valider les données
    const { preferences } = body;
    if (!preferences) {
      return NextResponse.json(
        { error: 'Préférences manquantes' },
        { status: 400 }
      );
    }

    // Sauvegarder les préférences dans la base de données
    // Pour l'instant, on simule la sauvegarde
    console.log(`Sauvegarde des préférences pour l'utilisateur ${userId}:`, preferences);

    // Ici, vous pourriez sauvegarder dans une vraie base de données:
    // await db.preferences.update({
    //   where: { userId },
    //   data: preferences
    // });

    return NextResponse.json({
      success: true,
      message: 'Préférences sauvegardées avec succès',
      preferences
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
