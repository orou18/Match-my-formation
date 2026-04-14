import { NextResponse } from "next/server";
import { readJsonStore } from "@/lib/server/json-store";

interface CreatorVideo {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  video_url: string;
  thumbnail: string;
  duration: string;
  is_published: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  views: number;
  likes: number;
  students_count: number;
}

export async function GET() {
  try {
    // Lire les vidéos des créateurs
    const creatorVideos: CreatorVideo[] = await readJsonStore(
      "creator-videos",
      []
    );

    // Filtrer uniquement les vidéos publiques (visibilité "public" et publiées)
    const publicCreatorVideos = creatorVideos.filter(
      (video) => video.is_published && video.visibility === "public"
    );

    // Normaliser les données pour le frontend
    const normalizedVideos = publicCreatorVideos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags,
      video_url: video.video_url,
      thumbnail: video.thumbnail,
      duration: video.duration,
      is_published: video.is_published,
      visibility: video.visibility,
      created_at: video.created_at,
      updated_at: video.updated_at,
      creator: {
        id: video.creator.id,
        name: video.creator.name,
        email: video.creator.email,
        avatar: video.creator.avatar || "/default-avatar.png",
      },
      views: video.views || 0,
      likes: video.likes || 0,
      students_count: video.students_count || 0,
      is_free: true,
      price: 0,
      resources: [],
      comments: [],
    }));

    return NextResponse.json({
      success: true,
      data: normalizedVideos,
      count: normalizedVideos.length,
      message: "Vidéos créateurs récupérées avec succès",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos créateurs:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        data: [],
        count: 0,
        message: "Erreur lors de la récupération des vidéos créateurs",
      },
      { status: 500 }
    );
  }
}
