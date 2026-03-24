import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data pour les notifications
const mockNotifications = [
  {
    id: '1',
    title: "Nouveau cours disponible",
    message: "Découvrez notre nouveau cours sur le marketing digital pour les créateurs",
    type: "info",
    target: "all",
    status: "sent",
    scheduledAt: undefined,
    sentAt: "2024-03-15T10:00:00Z",
    recipients: 2847,
    openedCount: 1256,
    clickedCount: 423,
    createdBy: "Jean Dupont",
    createdAt: "2024-03-15T09:30:00Z"
  },
  {
    id: '2',
    title: "Maintenance système",
    message: "Une maintenance est prévue ce soir de 22h à 23h",
    type: "warning",
    target: "all",
    status: "scheduled",
    scheduledAt: "2024-03-20T22:00:00Z",
    sentAt: undefined,
    recipients: 2847,
    openedCount: 0,
    clickedCount: 0,
    createdBy: "Marie Dubois",
    createdAt: "2024-03-18T14:00:00Z"
  },
  {
    id: '3',
    title: "Félicitations créateurs!",
    message: "Les créateurs ont généré 23% de revenus supplémentaires ce mois",
    type: "success",
    target: "creators",
    status: "sent",
    scheduledAt: undefined,
    sentAt: "2024-03-10T16:00:00Z",
    recipients: 156,
    openedCount: 89,
    clickedCount: 34,
    createdBy: "Sophie Martin",
    createdAt: "2024-03-10T15:45:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredNotifications = mockNotifications;

    // Filtrage
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(notification => notification.type === type);
    }
    if (status && status !== 'all') {
      filteredNotifications = filteredNotifications.filter(notification => notification.status === status);
    }
    if (search) {
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('ADMIN NOTIFICATIONS - Données récupérées:', filteredNotifications.length, 'notifications');
    
    return NextResponse.json({
      notifications: filteredNotifications,
      total: filteredNotifications.length,
      stats: {
        total: mockNotifications.length,
        sent: mockNotifications.filter(n => n.status === 'sent').length,
        scheduled: mockNotifications.filter(n => n.status === 'scheduled').length,
        draft: mockNotifications.filter(n => n.status === 'draft').length,
        totalOpened: mockNotifications.reduce((sum, n) => sum + n.openedCount, 0),
        totalClicked: mockNotifications.reduce((sum, n) => sum + n.clickedCount, 0),
        avgOpenRate: mockNotifications.length > 0 ? 
          Math.round(mockNotifications.reduce((sum, n) => sum + (n.openedCount / n.recipients) * 100, 0) / mockNotifications.length) : 0,
        avgClickRate: mockNotifications.filter(n => n.openedCount > 0).length > 0 ?
          Math.round(mockNotifications.filter(n => n.openedCount > 0).reduce((sum, n) => sum + (n.clickedCount / n.openedCount) * 100, 0) / mockNotifications.filter(n => n.openedCount > 0).length) : 0
      }
    });
  } catch (error) {
    console.error('ADMIN NOTIFICATIONS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const notificationData = await request.json();
    
    // Validation
    if (!notificationData.title || !notificationData.message || !notificationData.type || !notificationData.target) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Calculer le nombre de destinataires selon la cible
    let recipients = 0;
    switch (notificationData.target) {
      case 'all':
        recipients = 2847; // Total utilisateurs
        break;
      case 'users':
        recipients = 2691; // Utilisateurs uniquement
        break;
      case 'creators':
        recipients = 156; // Créateurs uniquement
        break;
      case 'admins':
        recipients = 4; // Administrateurs uniquement
        break;
    }

    // Créer une nouvelle notification
    const newNotification = {
      id: (mockNotifications.length + 1).toString(),
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      target: notificationData.target,
      status: notificationData.status || 'draft',
      scheduledAt: notificationData.scheduledAt,
      sentAt: notificationData.status === 'sent' ? new Date().toISOString() : undefined,
      recipients: recipients,
      openedCount: 0,
      clickedCount: 0,
      createdBy: (session.user as any).name || 'Admin',
      createdAt: new Date().toISOString()
    };

    mockNotifications.push(newNotification);
    
    console.log('ADMIN NOTIFICATIONS - Nouvelle notification créée:', newNotification);
    
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('ADMIN NOTIFICATIONS - Erreur création:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID notification requis' }, { status: 400 });
    }

    const notificationIndex = mockNotifications.findIndex(notification => notification.id === id);
    
    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    // Mettre à jour la notification
    mockNotifications[notificationIndex] = { ...mockNotifications[notificationIndex], ...updateData };
    
    console.log('ADMIN NOTIFICATIONS - Notification mise à jour:', id, updateData);
    
    return NextResponse.json(mockNotifications[notificationIndex]);
  } catch (error) {
    console.error('ADMIN NOTIFICATIONS - Erreur mise à jour:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID notification requis' }, { status: 400 });
    }

    const notificationIndex = mockNotifications.findIndex(notification => notification.id === id);
    
    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 });
    }

    const deletedNotification = mockNotifications.splice(notificationIndex, 1)[0];
    
    console.log('ADMIN NOTIFICATIONS - Notification supprimée:', deletedNotification);
    
    return NextResponse.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error('ADMIN NOTIFICATIONS - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
