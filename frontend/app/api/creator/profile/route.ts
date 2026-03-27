import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getProfile,
  getUserPreferences,
  updateAccount,
  updateProfile,
  updateUserPreferences,
} from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

async function resolveCreatorId(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (userId) return String(userId);

  const session = await getServerSession(authOptions);
  const sessionUser = (session?.user as SessionUser | undefined) || {};
  if (sessionUser.id && sessionUser.role === "creator") {
    return String(sessionUser.id);
  }

  return "2";
}

export async function GET(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const profile = getProfile(creatorId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    const preferences = getUserPreferences(creatorId);

    return NextResponse.json({
      ...profile,
      settings: {
        email_notifications: preferences.emailNotifications,
        push_notifications: preferences.pushNotifications,
        public_profile: true,
        language: preferences.language,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const { settings, ...profileUpdates } = body as {
      settings?: {
        email_notifications?: boolean;
        push_notifications?: boolean;
        public_profile?: boolean;
        language?: string;
      };
      name?: string;
      email?: string;
      phone?: string;
      bio?: string;
      location?: string;
      website?: string;
      avatar?: string;
    };

    updateAccount(creatorId, {
      name: profileUpdates.name,
      email: profileUpdates.email,
      phone: profileUpdates.phone,
      bio: profileUpdates.bio,
      location: profileUpdates.location,
      website: profileUpdates.website,
      avatar: profileUpdates.avatar,
    });

    const updated = updateProfile(creatorId, {
      name: profileUpdates.name,
      email: profileUpdates.email,
      phone: profileUpdates.phone,
      bio: profileUpdates.bio,
      location: profileUpdates.location,
      website: profileUpdates.website,
      avatar: profileUpdates.avatar,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    const preferences = updateUserPreferences(creatorId, {
      emailNotifications: settings?.email_notifications,
      pushNotifications: settings?.push_notifications,
      language: settings?.language,
    });

    return NextResponse.json({
      ...updated,
      settings: {
        email_notifications: preferences.emailNotifications,
        push_notifications: preferences.pushNotifications,
        public_profile: settings?.public_profile ?? true,
        language: preferences.language,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil créateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
