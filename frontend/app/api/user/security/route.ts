import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Récupérer les paramètres de sécurité
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Mock data - Remplacer par appel à votre base de données
    const securitySettings = {
      twoFactorEnabled: false,
      twoFactorMethod: "email",
      email: session.user?.email || "",
      phone: "+33 6 12 34 56 78",
      lastPasswordChange: "2024-03-15",
      activeSessions: 2
    };

    return NextResponse.json(securitySettings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de sécurité:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
