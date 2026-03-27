import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";

// Base de données mock pour démonstration
const mockDatabase: any[] = [
  {
    id: 1,
    name: "Direction Match Admin",
    email: "admin@match.com",
    phone: "+229 00 00 00 01",
    bio: "Administrateur principal de MatchMyFormation",
    location: "Cotonou, Bénin",
    website: "https://matchmyformation.com",
    avatar: "/avatars/admin.jpg",
    role: "admin",
    subscription: "PREMIUM",
    level: 10,
    joinDate: "15 janvier 2024",
    coursesCompleted: 50,
    certificates: 25,
    averageRating: 5.0,
    completionRate: 100,
    learningTime: 500,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: 2,
    name: "Jean Formateur",
    email: "creator@match.com",
    phone: "+229 00 00 00 02",
    bio: "Formateur expert en tourisme et hôtellerie",
    location: "Cotonou, Bénin",
    website: "https://jeanformateur.com",
    avatar: "/avatars/creator.jpg",
    role: "creator",
    subscription: "PREMIUM",
    level: 8,
    joinDate: "20 janvier 2024",
    coursesCompleted: 30,
    certificates: 15,
    averageRating: 4.9,
    completionRate: 95,
    learningTime: 350,
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
  },
  {
    id: 3,
    name: "Alice Élève",
    email: "student@match.com",
    phone: "+229 00 00 00 03",
    bio: "Passionnée par l'apprentissage et le développement personnel",
    location: "Cotonou, Bénin",
    website: "https://aliceportfolio.com",
    avatar: "/temoignage.png",
    role: "student",
    subscription: "FREE",
    level: 5,
    joinDate: "15 janvier 2024",
    coursesCompleted: 12,
    certificates: 8,
    averageRating: 4.7,
    completionRate: 85,
    learningTime: 156,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
];

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
    // Prioriser l'ID depuis le token
    const userId = getUserIdFromToken(request);

    // Fallback vers session NextAuth
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId = userId || (session?.user as any)?.id;

    if (!finalUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Chercher l'utilisateur dans la base de données mock
    const user = mockDatabase.find((u) => u.id === parseInt(finalUserId));

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const updates = await request.json();

    // Validation basique
    const allowedFields = [
      "name",
      "email",
      "phone",
      "bio",
      "location",
      "website",
    ];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    // Mock update - Remplacer par appel à votre base de données
    console.log("MISE À JOUR RÉELLE du profil:", filteredUpdates);

    // Simuler une mise à jour réussie avec les vraies données
    const updatedProfile = {
      id: (session.user as any)?.id || "1",
      name: filteredUpdates.name || session.user?.name || "Alice Élève",
      email:
        filteredUpdates.email || session.user?.email || "student@match.com",
      phone: filteredUpdates.phone || "+33 6 12 34 56 78",
      bio:
        filteredUpdates.bio ||
        "Passionnée par l'apprentissage et le développement personnel.",
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
      learningTime: 156,
    };

    console.log("Profil mis à jour avec succès:", updatedProfile);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
