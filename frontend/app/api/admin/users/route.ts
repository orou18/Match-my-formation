import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data basé sur le seeder
const mockUsers = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'chef@matchmyformation.com',
    role: 'creator',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-03-18',
    subscription: 'Premium',
    coursesCompleted: 12,
    avatar: '/temoignage.png',
    bio: 'Chef étoilé avec 15 ans d\'expérience',
    expertise: 'Cuisine française',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sophie Martin',
    email: 'sommelier@matchmyformation.com',
    role: 'creator',
    status: 'active',
    joinDate: '2024-02-20',
    lastActive: '2024-03-17',
    subscription: 'Pro',
    coursesCompleted: 8,
    avatar: '/temoignage.png',
    bio: 'MS en sommellerie',
    expertise: 'Vins et dégustation',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Pierre Bernard',
    email: 'restaurant@matchmyformation.com',
    role: 'creator',
    status: 'active',
    joinDate: '2024-03-10',
    lastActive: '2024-03-18',
    subscription: 'Premium',
    coursesCompleted: 15,
    avatar: '/temoignage.png',
    bio: 'Propriétaire de 3 restaurants',
    expertise: 'Gestion restaurant',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Marie Dubois',
    email: 'hotel@matchmyformation.com',
    role: 'student',
    status: 'active',
    joinDate: '2024-01-20',
    lastActive: '2024-03-18',
    subscription: 'Free',
    coursesCompleted: 3,
    avatar: '/temoignage.png',
    bio: 'Directrice d\'hôtel 5 étoiles',
    expertise: 'Hôtellerie luxe',
    rating: 4.6
  },
  {
    id: '5',
    name: 'Thomas Petit',
    email: 'barman@matchmyformation.com',
    role: 'student',
    status: 'active',
    joinDate: '2024-02-15',
    lastActive: '2024-03-17',
    subscription: 'Premium',
    coursesCompleted: 7,
    avatar: '/temoignage.png',
    bio: 'Champion de France de mixologie',
    expertise: 'Bar et cocktails',
    rating: 4.8
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredUsers = mockUsers;

    // Filtrage
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('ADMIN USERS - Données récupérées:', filteredUsers.length, 'utilisateurs');
    
    return NextResponse.json({
      users: filteredUsers,
      total: filteredUsers.length,
      stats: {
        total: mockUsers.length,
        creators: mockUsers.filter(u => u.role === 'creator').length,
        students: mockUsers.filter(u => u.role === 'student').length,
        admins: mockUsers.filter(u => u.role === 'admin').length,
        active: mockUsers.filter(u => u.status === 'active').length
      }
    });
  } catch (error) {
    console.error('ADMIN USERS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userData = await request.json();
    
    // Validation
    if (!userData.name || !userData.email || !userData.role) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Créer un nouvel utilisateur
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      subscription: userData.role === 'creator' ? 'Pro' : 'Free',
      coursesCompleted: 0,
      avatar: '/temoignage.png',
      bio: userData.bio || '',
      expertise: userData.expertise || '',
      rating: 0
    };

    mockUsers.push(newUser);
    
    console.log('ADMIN USERS - Nouvel utilisateur créé:', newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('ADMIN USERS - Erreur création:', error);
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
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'utilisateur
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData };
    
    console.log('ADMIN USERS - Utilisateur mis à jour:', id, updateData);
    
    return NextResponse.json(mockUsers[userIndex]);
  } catch (error) {
    console.error('ADMIN USERS - Erreur mise à jour:', error);
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
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    
    console.log('ADMIN USERS - Utilisateur supprimé:', deletedUser);
    
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('ADMIN USERS - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
