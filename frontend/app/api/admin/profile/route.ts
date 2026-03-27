import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProfile, updateProfile } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | undefined;
    const role = sessionUser?.role;

    if (!sessionUser || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const profile = getProfile(String(sessionUser.id));
    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        ...profile,
        department: "Administration",
        language: "fr",
        timezone: "Africa/Porto-Novo",
        twoFactorEnabled:
          role === "super_admin" || role === "admin",
        emailNotifications: true,
      },
      session: {
        user: session.user,
        role,
        permissions: profile.permissions || [],
      },
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | undefined;
    const role = sessionUser?.role;

    if (!sessionUser || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = [
      "name",
      "email",
      "bio",
      "phone",
      "location",
      "website",
      "avatar",
    ];

    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((result, key) => {
        result[key] = updates[key];
        return result;
      }, {} as Record<string, unknown>);

    const updated = updateProfile(String(sessionUser.id), filteredUpdates);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
