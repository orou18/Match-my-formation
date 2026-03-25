import { NextRequest, NextResponse } from 'next/server';

// Base de données simple pour les vidéos
let videos = [
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
    comments: [],
    tags: ["tourisme", "durable", "ecologie"],
    is_published: true,
    visibility: "public",
    learning_objectives: ["Comprendre les principes du tourisme durable"],
    resources: [],
    created_at: "2024-03-15T08:00:00Z",
    updated_at: "2024-03-15T08:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('CREATOR VIDEOS SIMPLE - GET request received');
    
    const creatorId = 1;
    const creatorVideos = videos.filter(video => video.creator_id === creatorId);
    
    console.log('CREATOR VIDEOS SIMPLE - Found videos:', creatorVideos.length);
    
    return NextResponse.json({
      videos: creatorVideos,
      total: creatorVideos.length
    });
  } catch (error) {
    console.error('CREATOR VIDEOS SIMPLE - Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('CREATOR VIDEOS SIMPLE - POST request received');
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const videoFile = formData.get('video_file') as File;
    
    if (!title || !description || !videoFile) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    
    const newVideo = {
      id: (videos.length + 1).toString(),
      title,
      description,
      thumbnail: "/videos/default-thumb.jpg",
      video_url: "/uploads/videos/" + videoFile.name,
      duration: "00:00",
      order: videos.length + 1,
      creator_id: 1,
      views: 0,
      likes: 0,
      comments: [],
      tags: [],
      is_published: true,
      visibility: "public",
      learning_objectives: [],
      resources: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    videos.push(newVideo);
    
    // Synchroniser avec final-videos
    try {
      const response = await fetch('http://localhost:3000/api/final-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          video: newVideo
        })
      });
      
      if (response.ok) {
        console.log('CREATOR VIDEOS SIMPLE - Synchronized with final-videos');
      }
    } catch (error) {
      console.error('CREATOR VIDEOS SIMPLE - Sync error:', error);
    }
    
    console.log('CREATOR VIDEOS SIMPLE - Video created:', newVideo.title);
    
    return NextResponse.json({
      message: 'Vidéo créée avec succès',
      video: newVideo
    }, { status: 201 });
  } catch (error) {
    console.error('CREATOR VIDEOS SIMPLE - Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('CREATOR VIDEOS SIMPLE - PUT request received');
    
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID vidéo requis' }, { status: 400 });
    }

    const videoIndex = videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    // Mettre à jour la vidéo
    videos[videoIndex] = { ...videos[videoIndex], ...updateData, updated_at: new Date().toISOString() };
    
    console.log('CREATOR VIDEOS SIMPLE - Vidéo mise à jour:', id);
    
    return NextResponse.json({
      message: 'Vidéo mise à jour avec succès',
      video: videos[videoIndex]
    });
  } catch (error) {
    console.error('CREATOR VIDEOS SIMPLE - Erreur mise à jour:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('CREATOR VIDEOS SIMPLE - DELETE request received');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID vidéo requis' }, { status: 400 });
    }

    const videoIndex = videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    // Supprimer la vidéo
    const deletedVideo = videos.splice(videoIndex, 1)[0];
    
    console.log('CREATOR VIDEOS SIMPLE - Vidéo supprimée:', id);
    
    return NextResponse.json({
      message: 'Vidéo supprimée avec succès',
      video: deletedVideo
    });
  } catch (error) {
    console.error('CREATOR VIDEOS SIMPLE - Erreur suppression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
