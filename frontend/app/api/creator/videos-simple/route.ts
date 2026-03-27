import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdFromToken } from "@/lib/auth";
import { VideoStore } from "@/lib/video-store";

type SessionUser = {
  id?: string | number;
  role?: string;
};

async function resolveCreatorId(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (userId) return Number(userId) || 2;

  const session = await getServerSession(authOptions);
  const sessionUser = (session?.user as SessionUser | undefined) || {};
  if (sessionUser.id && sessionUser.role === "creator") {
    return Number(sessionUser.id) || 2;
  }

  return 2;
}

async function getCreatorVideos(request: NextRequest) {
  const creatorId = await resolveCreatorId(request);
  return VideoStore.getVideos().filter(
    (video) => Number(video.creator_id) === creatorId
  );
}

export async function GET(request: NextRequest) {
  try {
    const creatorVideos = await getCreatorVideos(request);

    return NextResponse.json({
      videos: creatorVideos,
      total: creatorVideos.length,
    });
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const videos = VideoStore.getVideos();
    const newVideo = {
      id: String(Math.max(...videos.map((video) => Number(video.id)), 0) + 1),
      title,
      description,
      thumbnail: "/videos/video1-thumb.jpg",
      video_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      duration: "02:45",
      order: videos.length + 1,
      creator_id: creatorId,
      views: 0,
      likes: 0,
      comments: [],
      tags: [],
      is_published: true,
      visibility: "public",
      status: "published",
      students: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: "Général",
      language: "Français",
      learning_objectives: [],
      resources: [],
    };

    VideoStore.addVideo(newVideo);

    return NextResponse.json(
      {
        message: "Vidéo créée avec succès",
        video: newVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const existing = VideoStore.getVideos().find(
      (video) => video.id === id && Number(video.creator_id) === creatorId
    );
    if (!existing) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });
    }

    const updates = {
      ...updateData,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    VideoStore.updateVideo(id, updates);

    return NextResponse.json({
      message: "Vidéo mise à jour avec succès",
      video: { ...existing, ...updates },
    });
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const existing = VideoStore.getVideos().find(
      (video) => video.id === id && Number(video.creator_id) === creatorId
    );
    if (!existing) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });
    }

    VideoStore.deleteVideo(id);

    return NextResponse.json({
      message: "Vidéo supprimée avec succès",
      video: existing,
    });
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
