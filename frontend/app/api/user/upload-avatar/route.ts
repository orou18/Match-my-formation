import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getUserIdFromToken } from "@/lib/auth";
import { updateProfile } from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
};

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const session = userId ? null : await getServerSession(authOptions);
    const finalUserId =
      userId || (session?.user as SessionUser | undefined)?.id;

    if (!finalUserId) {
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

    // Validation du type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      );
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    // Créer le répertoire uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads", "avatars");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Le répertoire existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${finalUserId || "user"}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL de l'avatar
    const avatarUrl = `/uploads/avatars/${fileName}`;

    updateProfile(String(finalUserId), { avatar: avatarUrl });

    return NextResponse.json({
      message: "Avatar téléchargé avec succès",
      avatarUrl,
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'avatar:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
