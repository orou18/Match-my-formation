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
  generatedThumbnails: string[];
  selectedThumbnail?: string;
  students_count: number;
  views: number;
  likes: number;
  comments: any[];
  resources: any[];
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
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
    const is_admin_video = formData.get("is_admin_video") === "true";
    const is_published = formData.get("is_published") === "true";
    const resources = JSON.parse(formData.get("resources") as string || "[]");
    const generatedThumbnails = JSON.parse(formData.get("generated_thumbnails") as string || "[]");
    const selectedThumbnail = formData.get("selected_thumbnail") as string;
    
    // Gérer les fichiers
    const videoFile = formData.get("video") as File;
    const thumbnailFile = formData.get("thumbnail") as File;
    
    let videoUrl = "";
    let thumbnailUrl = "/default-thumbnail.jpg";
    
    // Upload la vidéo si fournie
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
          videoUrl = "/sample-video.mp4"; // Fallback
        }
      } catch (error) {
        console.error("Erreur upload vidéo:", error);
        videoUrl = "/sample-video.mp4"; // Fallback
      }
    } else {
      videoUrl = "/sample-video.mp4"; // Vidéo de démonstration
    }
    
    // Upload la miniature si fournie
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
    } else if (selectedThumbnail) {
      // Utiliser la miniature générée sélectionnée
      thumbnailUrl = selectedThumbnail;
    }
    
    // Créer l'objet vidéo
    const newVideo: AdminVideo = {
      id: Date.now(),
      title,
      description,
      category,
      tags,
      learning_objectives,
      visibility: "public", // Toujours public pour l'admin
      duration,
      allow_comments,
      publish_immediately,
      is_admin_video: true, // Marquer comme vidéo admin
      is_published: true, // Toujours publié pour l'admin
      resources,
      creator: {
        id: 0,
        name: "Administrateur",
        email: "admin@matchmyformation.com",
        avatar: "/admin-avatar.png",
      },
      video_url: videoUrl,
      thumbnail: thumbnailUrl,
      generatedThumbnails: generatedThumbnails,
      selectedThumbnail: selectedThumbnail,
      students_count: 0,
      views: 0,
      likes: 0,
      comments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Sauvegarder dans le store local (fallback)
    try {
      // Lire les vidéos existantes
      const existingVideos: AdminVideo[] = await readJsonStore("admin-videos", []);
      
      // Ajouter la nouvelle vidéo
      existingVideos.push(newVideo);
      
      // Sauvegarder
      await writeJsonStore("admin-videos", existingVideos);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde locale:", error);
    }

    // Retourner la réponse
    return NextResponse.json({
      success: true,
      message: "Vidéo admin créée avec succès",
      video: newVideo
    });

  } catch (error) {
    console.error("Erreur lors de la création de la vidéo admin:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la création de la vidéo" 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Lire les vidéos admin depuis le store local
    const adminVideos: AdminVideo[] = await readJsonStore("admin-videos", []);
    
    return NextResponse.json({
      success: true,
      data: adminVideos
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos admin:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la récupération des vidéos" 
      },
      { status: 500 }
    );
  }
}
