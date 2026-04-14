import { NextResponse } from "next/server";
import { fetchPublicVideosPayload } from "@/lib/api/public-videos-proxy";

type PublicVideo = {
  id: number | string;
  title?: string;
  description?: string;
  thumbnail?: string | null;
  duration?: string;
  views?: number;
  likes?: number;
  rating?: number;
  creator?: {
    id?: number | string;
    name?: string;
    email?: string;
    avatar?: string | null;
  };
  category?: string;
  tags?: string[];
  video_url?: string | null;
  is_published?: boolean;
  visibility?: string;
  created_at?: string;
  updated_at?: string;
  resources?: unknown[];
  is_free?: boolean;
  price?: number;
  comments?: unknown[];
  students_count?: number;
};

function normalizeVideo(video: PublicVideo) {
  return {
    id: Number(video.id),
    title: video.title || "Titre non disponible",
    description: video.description || "",
    thumbnail: video.thumbnail || "/placeholder-video.jpg",
    duration: video.duration || "00:00",
    views: Number(video.views || 0),
    likes: Number(video.likes || 0),
    rating: Number(video.rating || 0),
    creator: {
      id: Number(video.creator?.id || 0),
      name: video.creator?.name || "Anonyme",
      email: video.creator?.email || "",
      avatar: video.creator?.avatar || "/default-avatar.png",
    },
    category: video.category || "general",
    tags: Array.isArray(video.tags) ? video.tags : [],
    video_url: video.video_url || "",
    is_published: video.is_published ?? video.visibility === "public",
    visibility: video.visibility || "public",
    created_at: video.created_at || new Date().toISOString(),
    updated_at:
      video.updated_at || video.created_at || new Date().toISOString(),
    resources: Array.isArray(video.resources) ? video.resources : [],
    is_free: video.is_free ?? true,
    price: Number(video.price || 0),
    comments: Array.isArray(video.comments) ? video.comments : [],
    students_count: Number(video.students_count || video.views || 0),
  };
}

export async function GET() {
  try {
    const { response, body } = await fetchPublicVideosPayload();
    const videos = Array.isArray(body?.videos) ? body.videos : [];

    return NextResponse.json(
      {
        success: response.ok,
        data: videos.map(normalizeVideo),
        count: videos.length,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos publiques:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        data: [],
        count: 0,
        message: "Erreur lors de la récupération des vidéos publiques",
      },
      { status: 500 }
    );
  }
}
