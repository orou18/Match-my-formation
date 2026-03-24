import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Mock data - Remplacer par appel à votre base de données
    const userProfile = {
      id: (session.user as any)?.id || '1',
      name: session.user?.name || "Alice Élève",
      email: session.user?.email || "student@match.com",
      phone: "+33 6 12 34 56 78",
      bio: "Passionnée par l'apprentissage et le développement personnel.",
      location: "Paris, France",
      website: "www.aliceportfolio.com",
      avatar: session.user?.image || "/temoignage.png",
      role: (session.user as any)?.role || "student",
      subscription: "FREE",
      level: 3,
      joinDate: "2024-01-15",
      coursesCompleted: 12,
      certificates: 3,
      averageRating: 4.8,
      completionRate: 89,
      learningTime: 156
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const updates = await request.json();
    
    // Validation basique
    const allowedFields = ['name', 'email', 'phone', 'bio', 'location', 'website'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    // Mock update - Remplacer par appel à votre base de données
    console.log('MISE À JOUR RÉELLE du profil:', filteredUpdates);
    
    // Simuler une mise à jour réussie avec les vraies données
    const updatedProfile = {
      id: (session.user as any)?.id || '1',
      name: filteredUpdates.name || session.user?.name || "Alice Élève",
      email: filteredUpdates.email || session.user?.email || "student@match.com",
      phone: filteredUpdates.phone || "+33 6 12 34 56 78",
      bio: filteredUpdates.bio || "Passionnée par l'apprentissage et le développement personnel.",
      location: filteredUpdates.location || "Paris, France",
      website: filteredUpdates.website || "www.aliceportfolio.com",
      avatar: session.user?.image || "/temoignage.png",
      role: (session.user as any)?.role || "student",
      subscription: "FREE",
      level: 3,
      joinDate: "2024-01-15",
      coursesCompleted: 12,
      certificates: 3,
      averageRating: 4.8,
      completionRate: 89,
      learningTime: 156
    };

    console.log('Profil mis à jour avec succès:', updatedProfile);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
