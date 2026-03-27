import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("video") as File;
    const time = (formData.get("time") as string) || "00:00:05"; // Par défaut, capture à 5 secondes

    if (!videoFile) {
      return NextResponse.json(
        { error: "Aucune vidéo fournie" },
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
    if (!allowedVideoTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: "Type de vidéo non supporté" },
        { status: 400 }
      );
    }

    // Créer le répertoire pour les miniatures s'il n'existe pas
    const thumbnailDir = join(process.cwd(), "public", "uploads", "thumbnails");
    if (!existsSync(thumbnailDir)) {
      await mkdir(thumbnailDir, { recursive: true });
    }

    // Sauvegarder temporairement la vidéo
    const tempVideoPath = join(
      process.cwd(),
      "temp",
      `${Date.now()}-${videoFile.name}`
    );
    const tempDir = join(process.cwd(), "temp");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempVideoPath, buffer);

    // Générer un nom de fichier pour la miniature
    const timestamp = Date.now();
    const thumbnailName = `thumbnail-${timestamp}.jpg`;
    const thumbnailPath = join(thumbnailDir, thumbnailName);

    try {
      // Utiliser ffmpeg pour générer la miniature
      const { exec } = require("child_process");
      const { promisify } = require("util");
      const execAsync = promisify(exec);

      const ffmpegCommand = `ffmpeg -i "${tempVideoPath}" -ss ${time} -vframes 1 -vf "scale=640:360" "${thumbnailPath}"`;

      await execAsync(ffmpegCommand);

      // Nettoyer le fichier temporaire
      await unlink(tempVideoPath);

      const thumbnailUrl = `/uploads/thumbnails/${thumbnailName}`;

      console.log("GENERATE THUMBNAIL - Miniature générée:", thumbnailName);

      return NextResponse.json({
        message: "Miniature générée avec succès",
        url: thumbnailUrl,
        fileName: thumbnailName,
      });
    } catch (ffmpegError) {
      console.error("GENERATE THUMBNAIL - Erreur FFmpeg:", ffmpegError);

      // En cas d'erreur FFmpeg, générer une miniature par défaut
      const defaultThumbnailUrl = "/videos/default-thumb.jpg";

      return NextResponse.json({
        message:
          "Utilisation de la miniature par défaut (FFmpeg non disponible)",
        url: defaultThumbnailUrl,
        fileName: "default-thumb.jpg",
      });
    }
  } catch (error) {
    console.error("GENERATE THUMBNAIL - Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la miniature" },
      { status: 500 }
    );
  }
}

// Fonction helper pour supprimer les fichiers
async function unlink(path: string) {
  const { unlink } = require("fs/promises");
  try {
    await unlink(path);
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du fichier temporaire:",
      error
    );
  }
}
