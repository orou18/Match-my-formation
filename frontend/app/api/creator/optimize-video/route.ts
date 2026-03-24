import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const quality = formData.get('quality') as string || 'medium'; // low, medium, high
    
    if (!videoFile) {
      return NextResponse.json({ error: 'Aucune vidéo fournie' }, { status: 400 });
    }

    // Validation du type de fichier
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedVideoTypes.includes(videoFile.type)) {
      return NextResponse.json({ error: 'Type de vidéo non supporté' }, { status: 400 });
    }

    // Créer le répertoire pour les vidéos optimisées
    const outputDir = join(process.cwd(), 'public', 'uploads', 'videos', 'optimized');
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = videoFile.name.split('.').pop();
    const optimizedFileName = `optimized-${quality}-${timestamp}.${fileExtension}`;
    const outputPath = join(outputDir, optimizedFileName);

    // Sauvegarder temporairement la vidéo originale
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }
    
    const tempPath = join(tempDir, `temp-${timestamp}.${fileExtension}`);
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempPath, buffer);

    try {
      // Utiliser FFmpeg pour optimiser la vidéo
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      // Configuration selon la qualité
      const qualitySettings = {
        low: {
          crf: 28,
          maxrate: '800k',
          bufsize: '1600k',
          scale: '854:480' // 480p
        },
        medium: {
          crf: 23,
          maxrate: '2000k',
          bufsize: '4000k',
          scale: '1280:720' // 720p
        },
        high: {
          crf: 18,
          maxrate: '5000k',
          bufsize: '10000k',
          scale: '1920:1080' // 1080p
        }
      };

      const settings = qualitySettings[quality as keyof typeof qualitySettings] || qualitySettings.medium;

      const ffmpegCommand = `ffmpeg -i "${tempPath}" -vf "scale=${settings.scale}" -c:v libx264 -preset medium -crf ${settings.crf} -maxrate ${settings.maxrate} -bufsize ${settings.bufsize} -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;
      
      await execAsync(ffmpegCommand);

      // Récupérer les informations sur la taille
      const originalSize = videoFile.size;
      const { stat } = require('fs/promises');
      const optimizedStats = await stat(outputPath);
      const optimizedSize = optimizedStats.size;
      const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

      // Nettoyer le fichier temporaire
      const { unlink } = require('fs/promises');
      await unlink(tempPath);

      const optimizedUrl = `/uploads/videos/optimized/${optimizedFileName}`;

      console.log(`VIDEO OPTIMIZATION - Vidéo optimisée (${quality}):`, {
        original: `${(originalSize / 1024 / 1024).toFixed(1)}MB`,
        optimized: `${(optimizedSize / 1024 / 1024).toFixed(1)}MB`,
        compression: `${compressionRatio}%`
      });

      return NextResponse.json({
        message: 'Vidéo optimisée avec succès',
        optimized_url: optimizedUrl,
        original_size: originalSize,
        optimized_size: optimizedSize,
        compression_ratio: parseFloat(compressionRatio),
        quality,
        duration: 0 // Sera calculé avec FFprobe si nécessaire
      });
    } catch (ffmpegError) {
      console.error('VIDEO OPTIMIZATION - Erreur FFmpeg:', ffmpegError);
      
      // En cas d'erreur FFmpeg, retourner la vidéo originale
      const fallbackUrl = `/uploads/videos/${timestamp}-${videoFile.name}`;
      const fallbackPath = join(process.cwd(), 'public', 'uploads', 'videos', `${timestamp}-${videoFile.name}`);
      await writeFile(fallbackPath, buffer);

      return NextResponse.json({
        message: 'Optimisation non disponible, vidéo originale utilisée',
        optimized_url: fallbackUrl,
        original_size: videoFile.size,
        optimized_size: videoFile.size,
        compression_ratio: 0,
        quality: 'original'
      });
    }
  } catch (error) {
    console.error('VIDEO OPTIMIZATION - Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'optimisation de la vidéo' }, { status: 500 });
  }
}
