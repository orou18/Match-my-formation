import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserIdFromToken } from '@/lib/auth';

// GET - Récupérer les paramètres de sécurité
export async function GET(request: NextRequest) {
  try {
    // Prioriser l'ID depuis le token
    const userId = getUserIdFromToken(request);
    
    // Fallback vers session NextAuth
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as any)?.id;
    
    if (!finalUserId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Données de sécurité cohérentes avec UserIdManager
    const securitySettings = {
      twoFactorEnabled: finalUserId === '1' || finalUserId === '2', // Admin et creator ont 2FA
      twoFactorMethod: finalUserId === '1' ? "email" : "sms",
      email: finalUserId === '1' ? "admin@match.com" : 
              finalUserId === '2' ? "creator@match.com" : "student@match.com",
      phone: finalUserId === '1' ? "+229 00 00 00 01" : 
              finalUserId === '2' ? "+229 00 00 00 02" : "+229 00 00 00 03",
      lastPasswordChange: "2024-03-15",
      activeSessions: finalUserId === '1' ? 3 : finalUserId === '2' ? 2 : 1
    };

    return NextResponse.json(securitySettings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de sécurité:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
