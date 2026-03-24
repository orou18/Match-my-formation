import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data basé sur le seeder
const mockCreators = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'chef@matchmyformation.com',
    status: 'active',
    joinDate: '2024-01-15',
    courses: 12,
    students: 2847,
    revenue: 45678,
    rating: 4.8,
    totalViews: 125000,
    category: 'Cuisine',
    avatar: '/temoignage.png',
    bio: 'Chef étoilé avec 15 ans d\'expérience',
    expertise: 'Cuisine française',
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'Sophie Martin',
    email: 'sommelier@matchmyformation.com',
    status: 'active',
    joinDate: '2024-02-20',
    courses: 8,
    students: 1523,
    revenue: 28900,
    rating: 4.9,
    totalViews: 89000,
    category: 'Vins',
    avatar: '/temoignage.png',
    bio: 'MS en sommellerie',
    expertise: 'Vins et dégustation',
    verified: true,
    featured: false
  },
  {
    id: '3',
    name: 'Pierre Bernard',
    email: 'restaurant@matchmyformation.com',
    status: 'pending',
    joinDate: '2024-03-10',
    courses: 3,
    students: 456,
    revenue: 5400,
    rating: 4.7,
    totalViews: 23000,
    category: 'Gestion',
    avatar: '/temoignage.png',
    bio: 'Propriétaire de 3 restaurants',
    expertise: 'Gestion restaurant',
    verified: false,
    featured: false
  },
  {
    id: '4',
    name: 'Marie Dubois',
    email: 'hotel@matchmyformation.com',
    status: 'active',
    joinDate: '2024-01-20',
    courses: 15,
    students: 3421,
    revenue: 67800,
    rating: 4.6,
    totalViews: 198000,
    category: 'Hôtellerie',
    avatar: '/temoignage.png',
    bio: 'Directrice d\'hôtel 5 étoiles',
    expertise: 'Hôtellerie luxe',
    verified: true,
    featured: true
  },
  {
    id: '5',
    name: 'Thomas Petit',
    email: 'barman@matchmyformation.com',
    status: 'suspended',
    joinDate: '2024-02-15',
    courses: 5,
    students: 892,
    revenue: 12300,
    rating: 4.8,
    totalViews: 45000,
    category: 'Bar',
    avatar: '/temoignage.png',
    bio: 'Champion de France de mixologie',
    expertise: 'Bar et cocktails',
    verified: true,
    featured: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredCreators = mockCreators;

    // Filtrage
    if (status && status !== 'all') {
      filteredCreators = filteredCreators.filter(creator => creator.status === status);
    }
    if (category && category !== 'all') {
      filteredCreators = filteredCreators.filter(creator => creator.category === category);
    }
    if (search) {
      filteredCreators = filteredCreators.filter(creator => 
        creator.name.toLowerCase().includes(search.toLowerCase()) ||
        creator.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('ADMIN CREATORS - Données récupérées:', filteredCreators.length, 'créateurs');
    
    return NextResponse.json({
      creators: filteredCreators,
      total: filteredCreators.length,
      stats: {
        total: mockCreators.length,
        active: mockCreators.filter(c => c.status === 'active').length,
        pending: mockCreators.filter(c => c.status === 'pending').length,
        suspended: mockCreators.filter(c => c.status === 'suspended').length,
        verified: mockCreators.filter(c => c.verified).length,
        totalRevenue: mockCreators.reduce((sum, c) => sum + c.revenue, 0),
        totalStudents: mockCreators.reduce((sum, c) => sum + c.students, 0),
        totalViews: mockCreators.reduce((sum, c) => sum + c.totalViews, 0)
      }
    });
  } catch (error) {
    console.error('ADMIN CREATORS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const creatorData = await request.json();
    
    // Validation
    if (!creatorData.name || !creatorData.email || !creatorData.category) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Créer un nouveau créateur
    const newCreator = {
      id: (mockCreators.length + 1).toString(),
      name: creatorData.name,
      email: creatorData.email,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      courses: 0,
      students: 0,
      revenue: 0,
      rating: 0,
      totalViews: 0,
      category: creatorData.category,
      avatar: '/temoignage.png',
      bio: creatorData.bio || '',
      expertise: creatorData.expertise || '',
      verified: false,
      featured: false
    };

    mockCreators.push(newCreator);
    
    console.log('ADMIN CREATORS - Nouveau créateur créé:', newCreator);
    
    return NextResponse.json(newCreator, { status: 201 });
  } catch (error) {
    console.error('ADMIN CREATORS - Erreur création:', error);
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
      return NextResponse.json({ error: 'ID créateur requis' }, { status: 400 });
    }

    const creatorIndex = mockCreators.findIndex(creator => creator.id === id);
    
    if (creatorIndex === -1) {
      return NextResponse.json({ error: 'Créateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour le créateur
    mockCreators[creatorIndex] = { ...mockCreators[creatorIndex], ...updateData };
    
    console.log('ADMIN CREATORS - Créateur mis à jour:', id, updateData);
    
    return NextResponse.json(mockCreators[creatorIndex]);
  } catch (error) {
    console.error('ADMIN CREATORS - Erreur mise à jour:', error);
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
      return NextResponse.json({ error: 'ID créateur requis' }, { status: 400 });
    }

    const creatorIndex = mockCreators.findIndex(creator => creator.id === id);
    
    if (creatorIndex === -1) {
      return NextResponse.json({ error: 'Créateur non trouvé' }, { status: 404 });
    }

    const deletedCreator = mockCreators.splice(creatorIndex, 1)[0];
    
    console.log('ADMIN CREATORS - Créateur supprimé:', deletedCreator);
    
    return NextResponse.json({ message: 'Créateur supprimé avec succès' });
  } catch (error) {
    console.error('ADMIN CREATORS - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
