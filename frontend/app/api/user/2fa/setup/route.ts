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

    const { method } = await request.json();

    // Validation
    if (!method || !['email', 'sms', 'app'].includes(method)) {
      return NextResponse.json({ error: 'Méthode invalide' }, { status: 400 });
    }

    // Mock 2FA setup - Remplacer par votre logique réelle
    console.log('CONFIGURATION 2FA RÉELLE pour l\'utilisateur:', finalUserId);
    console.log('Email:', session?.user?.email || `user-${finalUserId}@match.com`);
    console.log('Méthode:', method);

    // Simuler l'envoi d'un code (code de test fixe pour la démo)
    const verificationCode = '123456'; // Code de test fixe
    console.log('Code de vérification (démo):', verificationCode);

    // Dans un vrai système, vous enverriez ce code par email ou SMS
    if (method === 'email') {
      console.log(`ENVOI EMAIL: Code ${verificationCode} envoyé à ${session?.user?.email || `user-${finalUserId}@match.com`}`);
      // Simuler un envoi d'email réussi
    } else if (method === 'sms') {
      console.log(`ENVOI SMS: Code ${verificationCode} envoyé par SMS`);
      // Simuler un envoi SMS réussi
    }

    return NextResponse.json({ 
      message: `Code de vérification envoyé par ${method}`,
      success: true,
      method: method,
      // En dev, retourner le code pour faciliter les tests
      ...(process.env.NODE_ENV === 'development' && { code: verificationCode })
    });
  } catch (error) {
    console.error('Erreur lors de la configuration 2FA:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
