import { NextRequest, NextResponse } from 'next/server';
import { VideoStore } from '@/lib/video-store';

export async function GET(request: NextRequest) {
  try {
    console.log('PUBLIC VIDEOS - Récupération des vidéos publiques');
    
    // Récupérer les vidéos publiques depuis le VideoStore
    const publicVideos = VideoStore.getPublicVideos();
    
    console.log('PUBLIC VIDEOS - Vidéos trouvées:', publicVideos.length);
    console.log('PUBLIC VIDEOS - Titres:', publicVideos.map(v => v.title));
    
    return NextResponse.json({
      videos: publicVideos,
      total: publicVideos.length
    });
  } catch (error) {
    console.error('PUBLIC VIDEOS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
