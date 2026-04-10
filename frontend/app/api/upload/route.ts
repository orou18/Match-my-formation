import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "video" ou "image"
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/mov", "video/quicktime"];
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    
    if (type === "video" && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Type de vidéo non supporté" },
        { status: 400 }
      );
    }
    
    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Type d'image non supporté" },
        { status: 400 }
      );
    }

    // Créer le répertoire uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const typeDir = join(uploadsDir, type === "video" ? "videos" : "images");
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    if (!existsSync(typeDir)) {
      await mkdir(typeDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(typeDir, fileName);
    
    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retourner l'URL publique
    const publicUrl = `/uploads/${type === "video" ? "videos" : "images"}/${fileName}`;
    
    return NextResponse.json({
      success: true,
      message: "Fichier uploadé avec succès",
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
}
