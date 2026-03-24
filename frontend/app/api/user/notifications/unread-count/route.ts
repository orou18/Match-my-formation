import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Mock unread count - Remplacer par appel à votre base de données
    // Simuler un nombre de notifications non lues
    const unreadCount = 3;

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
