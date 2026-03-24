import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { method } = await request.json();

    // Validation
    if (!method || !['email', 'sms', 'app'].includes(method)) {
      return NextResponse.json({ error: 'Méthode invalide' }, { status: 400 });
    }

    // Mock 2FA setup - Remplacer par votre logique réelle
    console.log('CONFIGURATION 2FA RÉELLE pour:', session.user?.email);
    console.log('Méthode:', method);

    // Simuler l'envoi d'un code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Code de vérification généré:', verificationCode);

    // Dans un vrai système, vous enverriez ce code par email ou SMS
    if (method === 'email') {
      console.log(`ENVOI EMAIL: Code ${verificationCode} envoyé à ${session.user?.email}`);
      // Simuler un envoi d'email réussi
    } else if (method === 'sms') {
      console.log(`ENVOI SMS: Code ${verificationCode} envoyé par SMS`);
      // Simuler un envoi SMS réussi
    }

    return NextResponse.json({ 
      message: `Code de vérification envoyé par ${method}`,
      success: true,
      // En dev, retourner le code pour faciliter les tests
      ...(process.env.NODE_ENV === 'development' && { code: verificationCode })
    });
  } catch (error) {
    console.error('Erreur lors de la configuration 2FA:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
