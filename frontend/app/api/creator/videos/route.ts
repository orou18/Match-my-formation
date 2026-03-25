import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data pour les vidéos du créateur
let creatorVideos = [
  {
    id: '1',
    title: "Introduction au Tourisme Durable",
    description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables pour un avenir responsable.",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "12:34",
    order: 1,
    creator_id: 1,
    views: 15420,
    likes: 892,
    comments: [
      {
        id: '1',
        user_id: 2,
        user_name: "Marie Laurent",
        user_avatar: "/temoignage.png",
        content: "Excellent contenu ! Très bien expliqué.",
        created_at: "2024-03-15T10:30:00Z",
        likes: 12
      }
    ],
    tags: ["tourisme", "durable", "ecologie"],
    is_published: true,
    visibility: "public",
    learning_objectives: [
      "Comprendre les principes du tourisme durable",
      "Identifier les pratiques écologiques",
      "Appliquer les normes de durabilité"
    ],
    resources: [
      {
        id: '1',
        title: "Guide du Tourisme Durable",
        type: "pdf",
        url: "/resources/guide-tourisme-durable.pdf",
        description: "Guide complet sur les pratiques durables",
        file_size: 2048576,
        created_at: "2024-03-15T09:00:00Z"
      },
      {
        id: '2',
        title: "Checklist Écologique",
        type: "document",
        url: "/resources/checklist-ecologique.pdf",
        description: "Checklist pour vérifier les pratiques durables",
        file_size: 1024000,
        created_at: "2024-03-15T10:00:00Z"
      }
    ],
    created_at: "2024-03-15T08:00:00Z",
    updated_at: "2024-03-15T08:00:00Z"
  },
  {
    id: '2',
    title: "Gestion Hôtelière Avancée",
    description: "Techniques avancées de gestion hôtelière pour les professionnels du secteur.",
    thumbnail: "/videos/video2-thumb.jpg",
    video_url: "/videos/video2.mp4",
    duration: "45:20",
    order: 2,
    creator_id: 1,
    views: 2890,
    students: 134,
    revenue: 980.50,
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    category: "Hôtellerie",
    price: 79.99,
    language: "Français"
  },
  {
    id: '3',
    title: "Marketing Touristique Digital",
    description: "Stratégies de marketing digital adaptées au secteur touristique et hôtelier.",
    thumbnail: "/videos/video3-thumb.jpg",
    video_url: "/videos/video3.mp4",
    duration: "38:15",
    order: 3,
    creator_id: 1,
    views: 2156,
    students: 98,
    revenue: 890.00,
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    category: "Marketing",
    price: 69.99,
    language: "Français"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Temporairement désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions);
    // 
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }

    // Simuler l'ID du créateur (en production, viendrait de la BDD)
    const creatorId = 1;

    // Utiliser les données locales
    const videos = creatorVideos.filter(video => video.creator_id === creatorId);
    
    console.log('CREATOR VIDEOS - Vidéos récupérées:', videos.length);
    
    return NextResponse.json({
      videos,
      stats: {
        total_videos: videos.length,
        total_views: videos.reduce((sum: number, video: any) => sum + video.views, 0),
        total_likes: videos.reduce((sum: number, video: any) => sum + video.likes, 0),
        total_comments: videos.reduce((sum: number, video: any) => sum + video.comments.length, 0),
        total_shares: Math.floor(Math.random() * 500) + 100,
        total_revenue: Math.floor(Math.random() * 5000) + 1000,
      }
    });
  } catch (error) {
    console.error('CREATOR VIDEOS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extraire les données du formulaire
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const learningObjectives = formData.get('learning_objectives') as string;
    const resourcesJson = formData.get('resources') as string;
    const visibility = formData.get('visibility') as string || 'private';
    const allowComments = formData.get('allow_comments') === 'true';
    const publishImmediately = formData.get('publish_immediately') === 'true';
    const videoFile = formData.get('video_file') as File;
    const thumbnailFile = formData.get('thumbnail') as File;

    // Validation
    if (!title || !description || !videoFile) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Traiter les ressources
    let resources = [];
    if (resourcesJson) {
      try {
        const parsedResources = JSON.parse(resourcesJson);
        resources = parsedResources.map((res: any, index: number) => ({
          id: (Date.now() + index).toString(),
          title: res.title,
          type: res.type,
          url: res.url,
          description: res.description,
          file_size: res.file_data?.size,
          created_at: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Erreur parsing resources:', error);
      }
    }

    // Créer les URLs pour les fichiers uploadés
    const videoUrl = `/uploads/videos/${Date.now()}-${videoFile.name}`;
    const thumbnailUrl = thumbnailFile ? `/uploads/thumbnails/${Date.now()}-${thumbnailFile.name}` : "/videos/default-thumb.jpg";

    // Simuler la création de la vidéo
    const newVideo = {
      id: (creatorVideos.length + 1).toString(),
      title,
      description,
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
      duration: "00:00", // Sera calculé après upload
      order: creatorVideos.length + 1,
      creator_id: 1,
      views: 0,
      likes: 0,
      comments: [],
      tags: category ? [category.toLowerCase()] : [],
      is_published: publishImmediately,
      visibility: visibility as "public" | "private" | "unlisted",
      learning_objectives: learningObjectives ? learningObjectives.split(',').map(obj => obj.trim()) : [],
      resources: resources,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    creatorVideos.push(newVideo);
    
    // Synchroniser avec l'API final-videos pour le dashboard étudiant
    try {
      const finalResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/final-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          video: newVideo
        })
      });
      
      if (finalResponse.ok) {
        console.log('CREATOR VIDEOS - Vidéo synchronisée avec final-videos');
      } else {
        console.error('CREATOR VIDEOS - Erreur synchronisation final-videos');
      }
    } catch (error) {
      console.error('CREATOR VIDEOS - Erreur synchronisation final-videos:', error);
    }
    
    console.log('CREATOR VIDEOS - Nouvelle vidéo créée:', newVideo.title);
    console.log('CREATOR VIDEOS - Total vidéos:', creatorVideos.length);
    
    return NextResponse.json({
      message: 'Vidéo créée avec succès',
      video: newVideo
    }, { status: 201 });
  } catch (error) {
    console.error('CREATOR VIDEOS - Erreur création:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Temporairement désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions);
    // 
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }

    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID vidéo requis' }, { status: 400 });
    }

    const videoIndex = creatorVideos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    // Mettre à jour la vidéo
    creatorVideos[videoIndex] = { ...creatorVideos[videoIndex], ...updateData, updated_at: new Date().toISOString() };
    
    console.log('CREATOR VIDEOS - Vidéo mise à jour:', id);
    
    return NextResponse.json({
      message: 'Vidéo mise à jour avec succès',
      video: creatorVideos[videoIndex]
    });
  } catch (error) {
    console.error('CREATOR VIDEOS - Erreur mise à jour:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Temporairement désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions);
    // 
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID vidéo requis' }, { status: 400 });
    }

    const videoIndex = creatorVideos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    // Supprimer la vidéo
    const deletedVideo = creatorVideos.splice(videoIndex, 1)[0];
    
    console.log('CREATOR VIDEOS - Vidéo supprimée:', id);
    
    return NextResponse.json({
      message: 'Vidéo supprimée avec succès',
      video: deletedVideo
    });
  } catch (error) {
    console.error('CREATOR VIDEOS - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
