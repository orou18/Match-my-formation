import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'video' ou 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    const allowedVideoTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (type === "video" && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de vidéo non supporté" },
        { status: 400 }
      );
    }

    if (type === "thumbnail" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type d'image non supporté" },
        { status: 400 }
      );
    }

    // Validation de la taille
    const maxSize = type === "video" ? 500 * 1024 * 1024 : 5 * 1024 * 1024; // 500MB pour vidéo, 5MB pour image
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux" },
        { status: 400 }
      );
    }

    // Créer le répertoire s'il n'existe pas
    const uploadDir =
      type === "video"
        ? join(process.cwd(), "public", "uploads", "videos")
        : join(process.cwd(), "public", "uploads", "thumbnails");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retourner l'URL du fichier
    const fileUrl =
      type === "video"
        ? `/uploads/videos/${fileName}`
        : `/uploads/thumbnails/${fileName}`;

    console.log(`UPLOAD ${type.toUpperCase()} - Fichier uploadé:`, fileName);

    return NextResponse.json({
      message: "Fichier uploadé avec succès",
      url: fileUrl,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("UPLOAD - Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
