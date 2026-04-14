import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

type BackendVideo = {
  id: string | number;
  title?: string;
  description?: string;
  category?: string;
  visibility?: "public" | "private" | "unlisted";
  duration?: string;
  allow_comments?: boolean;
  is_published?: boolean;
  thumbnail?: string | null;
  video_url?: string | null;
  views?: number;
  likes?: number;
  comments?: number | unknown[];
  created_at?: string;
  updated_at?: string;
};

function normalizeAdminVideo(video: BackendVideo) {
  return {
    id: Number(video.id),
    title: video.title || "Sans titre",
    description: video.description || "",
    category: video.category || "general",
    tags: [],
    learning_objectives: [],
    visibility: video.visibility || "public",
    duration: video.duration || "00:00",
    allow_comments: Boolean(video.allow_comments ?? true),
    publish_immediately: true,
    is_admin_video: true,
    is_published: video.is_published ?? video.visibility === "public",
    creator: {
      id: 0,
      name: "Administrateur",
      email: "admin@matchmyformation.com",
      avatar: "/temoignage.png",
    },
    video_url: video.video_url || "",
    thumbnail: video.thumbnail || "/placeholder-video.jpg",
    students_count: Number(video.views || 0),
    views: Number(video.views || 0),
    likes: Number(video.likes || 0),
    comments: Array.isArray(video.comments) ? video.comments : [],
    resources: [],
    created_at: video.created_at || new Date().toISOString(),
    updated_at:
      video.updated_at || video.created_at || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/videos", { request });
    const data = await parseLaravelJson(response);
    const videos = Array.isArray(data) ? data : data?.videos || [];

    return NextResponse.json(
      {
        success: response.ok,
        data: videos.map(normalizeAdminVideo),
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("ADMIN VIDEOS - Erreur chargement:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la récupération des vidéos admin",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = new FormData();

    const fieldNames = [
      "title",
      "description",
      "category",
      "duration",
      "allow_comments",
      "publish_immediately",
      "selected_thumbnail",
      "external_url",
    ];

    fieldNames.forEach((field) => {
      const value = formData.get(field);
      if (typeof value === "string" && value.length > 0) {
        payload.append(field, value);
      }
    });

    payload.append("visibility", "public");

    const video = formData.get("video");
    if (video instanceof File && video.size > 0) {
      payload.append("video", video);
    }

    const thumbnail = formData.get("thumbnail");
    if (thumbnail instanceof File && thumbnail.size > 0) {
      payload.append("thumbnail", thumbnail);
    }

    const response = await laravelFetch("/api/creator/videos", {
      request,
      method: "POST",
      body: payload,
    });
    const data = await parseLaravelJson(response);

    return NextResponse.json(
      {
        success: response.ok,
        message: data?.message || "Vidéo admin créée avec succès",
        video: data?.video ? normalizeAdminVideo(data.video) : null,
        error: data?.error,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("ADMIN VIDEOS - Erreur création:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création de la vidéo admin",
      },
      { status: 500 }
    );
  }
}
