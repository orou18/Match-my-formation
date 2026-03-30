import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { updateProfile } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validation du fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 5MB" },
        { status: 400 }
      );
    }

    // Créer le répertoire uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Le répertoire existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const filename = `admin_${sessionUser.id}_${timestamp}.${file.type.split("/")[1]}`;
    const filepath = path.join(uploadsDir, filename);

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    updateProfile(String(sessionUser.id), { avatar: avatarUrl });

    return NextResponse.json({
      message: "Avatar téléchargé avec succès",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("ADMIN PROFILE - Erreur upload avatar:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
