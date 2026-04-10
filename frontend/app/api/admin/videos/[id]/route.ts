import { NextRequest, NextResponse } from "next/server";
import { writeJsonStore, readJsonStore } from "@/lib/server/json-store";

interface AdminVideo {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  learning_objectives: string[];
  visibility: string;
  duration: string;
  allow_comments: boolean;
  publish_immediately: boolean;
  is_admin_video: boolean;
  is_published: boolean;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  video_url: string;
  thumbnail: string;
  students_count: number;
  views: number;
  likes: number;
  comments: any[];
  resources: any[];
  created_at: string;
  updated_at: string;
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const videoId = parseInt(id);
    
    if (isNaN(videoId)) {
      return NextResponse.json(
        { success: false, message: "ID de vidéo invalide" },
        { status: 400 }
      );
    }

    // Lire les vidéos existantes
    const existingVideos: AdminVideo[] = await readJsonStore("admin-videos", []);
    
    // Trouver et supprimer la vidéo
    const videoIndex = existingVideos.findIndex((video) => video.id === videoId);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Vidéo non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la vidéo
    existingVideos.splice(videoIndex, 1);
    
    // Sauvegarder la liste mise à jour
    await writeJsonStore("admin-videos", existingVideos);

    return NextResponse.json({
      success: true,
      message: "Vidéo supprimée avec succès",
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de la vidéo:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la suppression de la vidéo" 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("API GET: Looking for video ID:", id);
    const videoId = parseInt(id);
    console.log("API GET: Parsed videoId:", videoId);
    
    if (isNaN(videoId)) {
      console.log("API GET: Invalid videoId - NaN");
      return NextResponse.json(
        { success: false, message: "ID de vidéo invalide" },
        { status: 400 }
      );
    }

    // Lire les vidéos existantes
    const existingVideos: AdminVideo[] = await readJsonStore("admin-videos", []);
    console.log("API GET: Total videos found:", existingVideos.length);
    console.log("API GET: Video IDs:", existingVideos.map(v => v.id));
    
    // Trouver la vidéo
    const video = existingVideos.find((v) => v.id === videoId);
    console.log("API GET: Found video:", video ? "YES" : "NO");
    
    if (!video) {
      console.log("API GET: Video not found for ID:", videoId);
      return NextResponse.json(
        { success: false, message: "Vidéo non trouvée" },
        { status: 404 }
      );
    }

    console.log("API GET: Returning video data:", video);
    return NextResponse.json({
      success: true,
      data: video
    });

  } catch (error) {
    console.error("API GET: Erreur lors de la récupération de la vidéo:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération de la vidéo" 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const videoId = parseInt(id);
    
    if (isNaN(videoId)) {
      return NextResponse.json(
        { success: false, message: "ID de vidéo invalide" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Extraire les données du formulaire
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const tags = JSON.parse(formData.get("tags") as string || "[]");
    const learning_objectives = JSON.parse(formData.get("learning_objectives") as string || "[]");
    const visibility = formData.get("visibility") as string || "public";
    const duration = formData.get("duration") as string;
    const allow_comments = formData.get("allow_comments") === "true";
    const publish_immediately = formData.get("publish_immediately") === "true";
    const resources = JSON.parse(formData.get("resources") as string || "[]");
    
    // Lire les vidéos existantes
    const existingVideos: AdminVideo[] = await readJsonStore("admin-videos", []);
    
    // Trouver la vidéo à mettre à jour
    const videoIndex = existingVideos.findIndex((video) => video.id === videoId);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Vidéo non trouvée" },
        { status: 404 }
      );
    }

    // Gérer les fichiers
    const videoFile = formData.get("video") as File;
    const thumbnailFile = formData.get("thumbnail") as File;
    
    let videoUrl = existingVideos[videoIndex].video_url;
    let thumbnailUrl = existingVideos[videoIndex].thumbnail;
    
    // Upload la nouvelle vidéo si fournie
    if (videoFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", videoFile);
        uploadFormData.append("type", "video");
        
        const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload`, {
          method: "POST",
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          videoUrl = uploadResult.url;
        } else {
          console.error("Erreur lors de l'upload de la vidéo");
        }
      } catch (error) {
        console.error("Erreur upload vidéo:", error);
      }
    }
    
    // Upload la nouvelle miniature si fournie
    if (thumbnailFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", thumbnailFile);
        uploadFormData.append("type", "image");
        
        const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload`, {
          method: "POST",
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          thumbnailUrl = uploadResult.url;
        }
      } catch (error) {
        console.error("Erreur upload miniature:", error);
      }
    }

    // Mettre à jour la vidéo
    const updatedVideo: AdminVideo = {
      ...existingVideos[videoIndex],
      title,
      description,
      category,
      tags,
      learning_objectives,
      visibility: "public", // Toujours public pour l'admin
      duration,
      allow_comments,
      publish_immediately,
      resources,
      video_url: videoUrl,
      thumbnail: thumbnailUrl,
      updated_at: new Date().toISOString(),
    };

    existingVideos[videoIndex] = updatedVideo;
    
    // Sauvegarder
    await writeJsonStore("admin-videos", existingVideos);

    return NextResponse.json({
      success: true,
      message: "Vidéo mise à jour avec succès",
      video: updatedVideo
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la vidéo:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la mise à jour de la vidéo" 
      },
      { status: 500 }
    );
  }
}
