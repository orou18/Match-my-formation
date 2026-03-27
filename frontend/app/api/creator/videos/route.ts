import { NextRequest, NextResponse } from "next/server";
import { VideoStore } from "@/lib/video-store";

function normalizeVideo(video: any) {
  return {
    ...video,
    status: video.status || (video.is_published ? "published" : "draft"),
    students: video.students || 0,
    revenue: video.revenue || 0,
    createdAt: video.createdAt || video.created_at,
    updatedAt: video.updatedAt || video.updated_at,
    category: video.category || video.tags?.[0] || "Général",
    language: video.language || "Français",
  };
}

export async function GET(request: NextRequest) {
  try {
    const videos = VideoStore.getVideos()
      .filter((video) => video.creator_id === 1)
      .map(normalizeVideo);

    return NextResponse.json({
      videos,
      stats: {
        total_videos: videos.length,
        total_views: videos.reduce(
          (sum: number, video: any) => sum + (video.views || 0),
          0
        ),
        total_likes: videos.reduce(
          (sum: number, video: any) => sum + (video.likes || 0),
          0
        ),
        total_comments: videos.reduce(
          (sum: number, video: any) =>
            sum + ((video.comments || []).length || 0),
          0
        ),
        total_shares: 0,
        total_revenue: videos.reduce(
          (sum: number, video: any) => sum + (video.revenue || 0),
          0
        ),
      },
    });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const visibility = (formData.get("visibility") as string) || "public";
    const publishImmediately = formData.get("publish_immediately") === "true";

    if (!title || !description) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const videos = VideoStore.getVideos();
    const now = new Date().toISOString();
    const newVideo = normalizeVideo({
      id: String(Math.max(...videos.map((video) => Number(video.id)), 0) + 1),
      title,
      description,
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      duration: "02:45",
      order: videos.length + 1,
      creator_id: 1,
      views: 0,
      likes: 0,
      comments: [],
      tags: category ? [category.toLowerCase()] : [],
      is_published: publishImmediately,
      visibility,
      learning_objectives: [],
      resources: [],
      created_at: now,
      updated_at: now,
      createdAt: now,
      updatedAt: now,
      category: category || "Général",
      language: "Français",
      students: 0,
      revenue: 0,
    });

    VideoStore.addVideo(newVideo);

    return NextResponse.json(
      {
        message: "Vidéo créée avec succès",
        video: newVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const existing = VideoStore.getVideos().find((video) => video.id === id);
    if (!existing) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });
    }

    const updates = normalizeVideo({
      ...updateData,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    VideoStore.updateVideo(id, updates);

    return NextResponse.json({
      message: "Vidéo mise à jour avec succès",
      video: { ...existing, ...updates },
    });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const existing = VideoStore.getVideos().find((video) => video.id === id);
    if (!existing) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });
    }

    VideoStore.deleteVideo(id);

    return NextResponse.json({
      message: "Vidéo supprimée avec succès",
      video: existing,
    });
  } catch (error) {
    console.error("CREATOR VIDEOS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
