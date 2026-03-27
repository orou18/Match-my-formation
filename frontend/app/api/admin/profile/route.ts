import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock data pour le profil admin
const mockAdminProfiles = {
  "jean.dupont@platform.com": {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@platform.com",
    role: "super_admin",
    permissions: [
      "users_view",
      "users_create",
      "users_edit",
      "users_delete",
      "creators_view",
      "creators_manage",
      "content_view",
      "content_manage",
      "ads_manage",
      "webinars_manage",
      "analytics_view",
      "settings_system",
    ],
    avatar: "/temoignage.png",
    bio: "Super administrateur avec plus de 10 ans d'expérience dans la gestion de plateformes éducatives",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    department: "Direction Générale",
    joinDate: "2023-06-01",
    lastLogin: "2024-03-18T14:30:00Z",
    status: "active",
    twoFactorEnabled: true,
    emailNotifications: true,
    language: "fr",
    timezone: "Europe/Paris",
  },
  "marie.laurent@platform.com": {
    id: "2",
    name: "Marie Laurent",
    email: "marie.laurent@platform.com",
    role: "admin",
    permissions: [
      "users_view",
      "users_edit",
      "creators_view",
      "content_view",
      "analytics_view",
    ],
    avatar: "/temoignage.png",
    bio: "Administratrice spécialisée dans la gestion des contenus et des utilisateurs",
    phone: "+33 6 98 76 54 32",
    location: "Lyon, France",
    department: "Contenu",
    joinDate: "2023-08-15",
    lastLogin: "2024-03-18T10:15:00Z",
    status: "active",
    twoFactorEnabled: false,
    emailNotifications: true,
    language: "fr",
    timezone: "Europe/Paris",
  },
  "pierre.martin@platform.com": {
    id: "3",
    name: "Pierre Martin",
    email: "pierre.martin@platform.com",
    role: "admin",
    permissions: [
      "users_view",
      "creators_view",
      "creators_manage",
      "content_manage",
    ],
    avatar: "/temoignage.png",
    bio: "Administrateur focus sur la gestion des créateurs et la modération des contenus",
    phone: "+33 6 45 67 89 01",
    location: "Marseille, France",
    department: "Créateurs",
    joinDate: "2023-10-20",
    lastLogin: "2024-03-17T16:45:00Z",
    status: "active",
    twoFactorEnabled: true,
    emailNotifications: false,
    language: "fr",
    timezone: "Europe/Paris",
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userEmail = (session.user as any).email;
    const profile =
      mockAdminProfiles[userEmail as keyof typeof mockAdminProfiles];

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    console.log("ADMIN PROFILE - Profil chargé pour:", userEmail);

    return NextResponse.json({
      profile: profile,
      session: {
        user: session.user,
        role: (session.user as any).role,
        permissions: profile.permissions,
      },
    });
  } catch (error) {
    console.error("ADMIN PROFILE - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userEmail = (session.user as any).email;
    const profile =
      mockAdminProfiles[userEmail as keyof typeof mockAdminProfiles];

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    const updateData = await request.json();

    // Vérifier les permissions
    const isSuperAdmin = (session.user as any).role === "super_admin";
    const hasEditPermission =
      profile.permissions.includes("profile_edit") || isSuperAdmin;

    if (!hasEditPermission) {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        { status: 403 }
      );
    }

    // Champs modifiables selon le rôle
    const allowedFields = isSuperAdmin
      ? [
          "name",
          "email",
          "bio",
          "phone",
          "location",
          "department",
          "emailNotifications",
          "language",
        ]
      : ["bio", "phone", "location", "emailNotifications", "language"];

    // Filtrer les données autorisées
    const filteredData: any = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    // Mettre à jour le profil
    Object.assign(profile, filteredData);

    console.log(
      "ADMIN PROFILE - Profil mis à jour pour:",
      userEmail,
      filteredData
    );

    return NextResponse.json(profile);
  } catch (error) {
    console.error("ADMIN PROFILE - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
