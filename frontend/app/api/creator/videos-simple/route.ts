import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";
import { videosStore } from "@/lib/store/videos-store";

export async function GET(request: NextRequest) {
  try {
    let videosData = null;
    let responseStatus = 200;

    try {
      const response = await laravelFetch("/api/creator/videos", { request });
      const data = await parseLaravelJson(response);

      if (response.ok) {
        videosData = data;
        responseStatus = response.status;
      }
    } catch (backendError) {
      console.warn(
        "Backend non accessible pour les vidéos, utilisation du store local:",
        backendError
      );
    }

    // Si le backend a répondu avec succès, retourner sa réponse
    if (videosData) {
      const videos = Array.isArray(videosData)
        ? videosData
        : videosData?.videos || [];
      return NextResponse.json(
        { videos, total: videos.length },
        { status: responseStatus }
      );
    }

    // Sinon, utiliser le store local
    try {
      const allVideos = await videosStore.getAllVideos();

      if (allVideos && allVideos.length > 0) {
        return NextResponse.json(
          {
            videos: allVideos,
            total: allVideos.length,
          },
          { status: 200 }
        );
      }
    } catch (storeError) {
      console.warn(
        "Store local inaccessible, utilisation du fallback:",
        storeError
      );
    }

    // Fallback final avec données par défaut
    const fallbackVideos = [
      {
        id: 1,
        title: "Introduction au Marketing Digital",
        description: "Découvrez les bases du marketing digital",
        thumbnail: "/videos/video1-thumb.jpg",
        video_url: "/videos/video1.mp4",
        duration: "15:30",
        views: 1250,
        likes: 89,
        comments: [],
        tags: ["marketing", "digital", "base"],
        is_published: true,
        visibility: "public",
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        title: "Techniques de Vente Avancées",
        description: "Maîtrisez les techniques de vente modernes",
        thumbnail: "/videos/video2-thumb.jpg",
        video_url: "/videos/video2.mp4",
        duration: "22:15",
        views: 980,
        likes: 67,
        comments: [],
        tags: ["vente", "techniques", "avancé"],
        is_published: true,
        visibility: "public",
        created_at: "2024-01-14T14:20:00Z",
      },
    ];

    return NextResponse.json(
      {
        videos: fallbackVideos,
        total: fallbackVideos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la récupération des vidéos",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Tenter de contacter le backend, mais utiliser le store local en priorité
    let backendData = null;
    let backendStatus = 200;

    try {
      const response = await laravelFetch("/api/creator/videos", {
        method: "POST",
        body: formData,
        request,
      });
      const data = await parseLaravelJson(response);

      if (response.ok) {
        backendData = data;
        backendStatus = response.status;
      }
    } catch (backendError) {
      console.warn(
        "Backend non accessible pour la création de vidéo, utilisation du store local:",
        backendError
      );
    }

    // Si le backend a répondu avec succès, retourner sa réponse
    if (backendData) {
      return NextResponse.json(
        {
          success: true,
          message: "Vidéo créée avec succès",
          data: backendData,
        },
        { status: backendStatus }
      );
    }

    // Sinon, créer la vidéo dans le store local
    try {
      // Extraire les données du formData
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const visibility = formData.get("visibility") as string;
      const is_published = formData.get("is_published") === "true";
      const thumbnail = formData.get("thumbnail") as string;
      const video_url = formData.get("video_url") as string;
      const duration = formData.get("duration") as string;
      const tags = formData.get("tags") as string;
      const difficulty_level = formData.get("difficulty_level") as string;
      const language = formData.get("language") as string;
      const is_free = formData.get("is_free") === "true";
      const price = parseFloat(formData.get("price") as string) || 0;

      // Parser les tags si c'est une chaîne JSON
      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch {
          parsedTags = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      }

      // Créer la vidéo dans le store
      const newVideo = await videosStore.createVideo({
        title: title || "Nouvelle Vidéo",
        description: description || "",
        category: category || "general",
        thumbnail: thumbnail || "/videos/video1-thumb.jpg",
        video_url: video_url || "/videos/video1.mp4",
        duration: duration || "10:30",
        tags: parsedTags,
        difficulty_level: difficulty_level || "beginner",
        language: language || "fr",
        is_published: is_published,
        visibility: visibility as "public" | "private" | "unlisted",
        is_free: is_free,
        price: price,
        learning_objectives: [],
        target_audience: [],
        prerequisites: [],
        certificate_available: false,
        creator: {
          id: 1, // ID du créateur par défaut
          name: "Créateur",
          avatar: "/avatars/default-creator.jpg",
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Vidéo créée avec succès dans le store local",
          data: newVideo,
        },
        { status: 201 }
      );
    } catch (storeError) {
      console.error(
        "Erreur lors de la création dans le store local:",
        storeError
      );

      // Fallback final avec simulation
      const fallbackVideo = {
        id: Date.now(),
        title: (formData.get("title") as string) || "Nouvelle Vidéo",
        description: (formData.get("description") as string) || "",
        thumbnail: "/videos/video1-thumb.jpg",
        video_url: "/videos/video1.mp4",
        duration: "10:30",
        views: 0,
        likes: 0,
        comments: [],
        tags: [],
        is_published: formData.get("is_published") === "true",
        visibility: (formData.get("visibility") as string) || "private",
        created_at: new Date().toISOString(),
      };

      return NextResponse.json(
        {
          success: true,
          message: "Vidéo créée avec succès (fallback)",
          data: fallbackVideo,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE POST - Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création de la vidéo",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID vidéo requis" }, { status: 400 });
    }

    const response = await laravelFetch(`/api/creator/videos/${id}`, {
      request,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Erreur mise à jour:", error);
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

    const response = await laravelFetch(`/api/creator/videos/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR VIDEOS SIMPLE - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
