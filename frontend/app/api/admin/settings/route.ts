import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data pour les paramètres système
const mockSettings = {
  siteName: "Match My Formation",
  siteUrl: "https://matchmyformation.com",
  adminEmail: "admin@matchmyformation.com",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  defaultLanguage: "fr",
  theme: "light",
  maxUploadSize: 10,
  sessionTimeout: 30
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log('ADMIN SETTINGS - Paramètres récupérés');
    
    return NextResponse.json({
      settings: mockSettings,
      systemInfo: {
        version: "v2.1.0",
        php: "8.2.0",
        database: "MySQL 8.0",
        diskSpace: "45.2 GB / 100 GB",
        memory: "2.1 GB / 4 GB"
      }
    });
  } catch (error) {
    console.error('ADMIN SETTINGS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const settingsData = await request.json();
    
    // Valider les données
    if (!settingsData.siteName || !settingsData.siteUrl || !settingsData.adminEmail) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Mettre à jour les paramètres (simulation)
    Object.assign(mockSettings, settingsData);
    
    console.log('ADMIN SETTINGS - Paramètres mis à jour:', settingsData);
    
    return NextResponse.json({
      message: 'Paramètres sauvegardés avec succès',
      settings: mockSettings
    });
  } catch (error) {
    console.error('ADMIN SETTINGS - Erreur sauvegarde:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { action } = await request.json();

    switch (action) {
      case 'backup':
        console.log('ADMIN SETTINGS - Sauvegarde demandée');
        return NextResponse.json({
          message: 'Sauvegarde créée avec succès',
          backupFile: `backup_${new Date().toISOString().split('T')[0]}.sql`
        });
        
      case 'restore':
        console.log('ADMIN SETTINGS - Restauration demandée');
        return NextResponse.json({
          message: 'Restauration effectuée avec succès'
        });
        
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('ADMIN SETTINGS - Erreur action:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
