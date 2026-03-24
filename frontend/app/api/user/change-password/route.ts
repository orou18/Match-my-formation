import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Prioriser l'ID depuis le token
    const userId = getUserIdFromToken(request);
    
    // Fallback vers session NextAuth
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as any)?.id;
    
    if (!finalUserId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validation basique
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
    }

    // Simulation de vérification du mot de passe actuel cohérente avec UserIdManager
    const validPasswords = {
      '1': 'Admin123!',
      '2': 'Creator123!',
      '3': 'Student123!'
    };

    if (validPasswords[finalUserId as keyof typeof validPasswords] !== currentPassword) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
    }

    // Mock password change - Remplacer par votre logique d'authentification
    console.log('Changement de mot de passe pour l\'utilisateur:', finalUserId);
    console.log('Email:', session?.user?.email || `user-${finalUserId}@match.com`);

    // Simuler une mise à jour réussie
    return NextResponse.json({ 
      success: true,
      message: 'Mot de passe mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
