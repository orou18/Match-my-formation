import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'pdf', 'document', 'image'
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation du type de fichier selon le type de ressource
    const allowedTypes = {
      pdf: ['application/pdf'],
      document: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ],
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    const allowedFileTypes = allowedTypes[type as keyof typeof allowedTypes] || [];
    
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Type de fichier non supporté pour ${type}. Types acceptés: ${allowedFileTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Validation de la taille (max 10MB pour les documents, 5MB pour les images)
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Fichier trop volumineux. Maximum: ${type === 'image' ? '5MB' : '10MB'}` 
      }, { status: 400 });
    }

    // Créer le répertoire s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resources', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retourner l'URL du fichier
    const fileUrl = `/uploads/resources/${type}/${fileName}`;

    console.log(`UPLOAD RESOURCE - Fichier ${type} uploadé:`, fileName);

    return NextResponse.json({
      message: 'Ressource uploadée avec succès',
      url: fileUrl,
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      resourceType: type
    });
  } catch (error) {
    console.error('UPLOAD RESOURCE - Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload de la ressource' }, { status: 500 });
  }
}
