import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data pour les administrateurs
const mockAdmins = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@platform.com',
    role: 'super_admin',
    permissions: [
      'users_view', 'users_create', 'users_edit', 'users_delete',
      'creators_view', 'creators_manage', 'content_view', 'content_manage',
      'ads_manage', 'webinars_manage', 'analytics_view', 'settings_system'
    ],
    status: 'active',
    lastLogin: '2024-03-18T14:30:00Z',
    avatar: '/temoignage.png',
    createdAt: '2023-06-01'
  },
  {
    id: '2',
    name: 'Marie Laurent',
    email: 'marie.laurent@platform.com',
    role: 'admin',
    permissions: ['users_view', 'users_edit', 'creators_view', 'content_view', 'analytics_view'],
    status: 'active',
    lastLogin: '2024-03-18T10:15:00Z',
    avatar: '/temoignage.png',
    createdAt: '2023-08-15'
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'pierre.martin@platform.com',
    role: 'admin',
    permissions: ['users_view', 'creators_view', 'creators_manage', 'content_manage'],
    status: 'active',
    lastLogin: '2024-03-17T16:45:00Z',
    avatar: '/temoignage.png',
    createdAt: '2023-10-20'
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@platform.com',
    role: 'admin',
    permissions: ['content_view', 'content_manage', 'ads_manage', 'webinars_manage'],
    status: 'inactive',
    lastLogin: '2024-03-15T09:20:00Z',
    avatar: '/temoignage.png',
    createdAt: '2023-12-10'
  }
];

// Toutes les permissions disponibles
const allPermissions = [
  { id: 'users_view', name: 'Voir utilisateurs', description: 'Accéder à la liste des utilisateurs', category: 'Utilisateurs' },
  { id: 'users_create', name: 'Créer utilisateurs', description: 'Créer de nouveaux comptes', category: 'Utilisateurs' },
  { id: 'users_edit', name: 'Modifier utilisateurs', description: 'Modifier les comptes existants', category: 'Utilisateurs' },
  { id: 'users_delete', name: 'Supprimer utilisateurs', description: 'Supprimer des comptes', category: 'Utilisateurs' },
  { id: 'creators_view', name: 'Voir créateurs', description: 'Accéder à la liste des créateurs', category: 'Créateurs' },
  { id: 'creators_manage', name: 'Gérer créateurs', description: 'Approuver/suspendre les créateurs', category: 'Créateurs' },
  { id: 'content_view', name: 'Voir contenus', description: 'Accéder à tous les contenus', category: 'Contenus' },
  { id: 'content_manage', name: 'Gérer contenus', description: 'Modérer et gérer les contenus', category: 'Contenus' },
  { id: 'ads_manage', name: 'Gérer publicités', description: 'Créer et gérer les campagnes', category: 'Publicités' },
  { id: 'webinars_manage', name: 'Gérer webinaires', description: 'Organiser et modérer les webinaires', category: 'Webinaires' },
  { id: 'analytics_view', name: 'Voir analytics', description: 'Accéder aux statistiques', category: 'Analytics' },
  { id: 'settings_system', name: 'Paramètres système', description: 'Configurer la plateforme', category: 'Système' },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let filteredAdmins = mockAdmins;

    if (search) {
      filteredAdmins = filteredAdmins.filter(admin => 
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('ADMIN ADMINS - Données récupérées:', filteredAdmins.length, 'administrateurs');
    
    return NextResponse.json({
      admins: filteredAdmins,
      total: filteredAdmins.length,
      permissions: allPermissions,
      stats: {
        total: mockAdmins.length,
        active: mockAdmins.filter(a => a.status === 'active').length,
        inactive: mockAdmins.filter(a => a.status === 'inactive').length,
        superAdmins: mockAdmins.filter(a => a.role === 'super_admin').length,
        admins: mockAdmins.filter(a => a.role === 'admin').length
      }
    });
  } catch (error) {
    console.error('ADMIN ADMINS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Non autorisé - Super Admin requis' }, { status: 401 });
    }

    const adminData = await request.json();
    
    // Validation
    if (!adminData.name || !adminData.email || !adminData.role) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Déterminer les permissions selon le rôle
    let permissions = [];
    if (adminData.role === 'super_admin') {
      permissions = allPermissions.map(p => p.id);
    } else {
      permissions = adminData.permissions || [];
    }

    // Créer un nouvel administrateur
    const newAdmin = {
      id: (mockAdmins.length + 1).toString(),
      name: adminData.name,
      email: adminData.email,
      role: adminData.role,
      permissions: permissions,
      status: 'active',
      lastLogin: '',
      avatar: '/temoignage.png',
      createdAt: new Date().toISOString().split('T')[0]
    };

    mockAdmins.push(newAdmin);
    
    console.log('ADMIN ADMINS - Nouvel administrateur créé:', newAdmin);
    
    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('ADMIN ADMINS - Erreur création:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Non autorisé - Super Admin requis' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID administrateur requis' }, { status: 400 });
    }

    const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
    
    if (adminIndex === -1) {
      return NextResponse.json({ error: 'Administrateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour les permissions si le rôle change
    if (updateData.role) {
      if (updateData.role === 'super_admin') {
        updateData.permissions = allPermissions.map(p => p.id);
      }
    }

    // Mettre à jour l'administrateur
    mockAdmins[adminIndex] = { ...mockAdmins[adminIndex], ...updateData };
    
    console.log('ADMIN ADMINS - Administrateur mis à jour:', id, updateData);
    
    return NextResponse.json(mockAdmins[adminIndex]);
  } catch (error) {
    console.error('ADMIN ADMINS - Erreur mise à jour:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Non autorisé - Super Admin requis' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID administrateur requis' }, { status: 400 });
    }

    // Empêcher la suppression du dernier super admin
    const adminToDelete = mockAdmins.find(admin => admin.id === id);
    if (adminToDelete?.role === 'super_admin') {
      const superAdminCount = mockAdmins.filter(a => a.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: 'Impossible de supprimer le dernier Super Admin' }, { status: 400 });
      }
    }

    const adminIndex = mockAdmins.findIndex(admin => admin.id === id);
    
    if (adminIndex === -1) {
      return NextResponse.json({ error: 'Administrateur non trouvé' }, { status: 404 });
    }

    const deletedAdmin = mockAdmins.splice(adminIndex, 1)[0];
    
    console.log('ADMIN ADMINS - Administrateur supprimé:', deletedAdmin);
    
    return NextResponse.json({ message: 'Administrateur supprimé avec succès' });
  } catch (error) {
    console.error('ADMIN ADMINS - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
