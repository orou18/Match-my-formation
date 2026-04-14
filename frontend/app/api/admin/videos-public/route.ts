import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    // Cet endpoint est PUBLIC - pas besoin d'authentification
    // Il retourne uniquement les vidéos admin PUBLIQUES pour le catalogue

    // Appeler l'API Laravel pour récupérer les vidéos admin publiques
    const response = await laravelFetch("/api/admin/videos-public", {
      request,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      // Transformer les données pour correspondre à l'interface frontend
      const adminVideos = Array.isArray(data?.videos)
        ? data.videos.map((video: any) => ({
            ...video,
            is_admin_video: true,
            id: video.id,
            title: video.title || "Vidéo Admin",
            description: video.description || "",
            thumbnail:
              video.thumbnail || video.image || "/placeholder-course.jpg",
            duration: video.duration || "00:00",
            video_url: video.video_url || "",
            category: video.category || "Formation",
            tags: video.tags || [],
            is_published: video.is_published ?? true,
            created_at: video.created_at || new Date().toISOString(),
            creator: {
              id: 0,
              name: "Admin",
              email: "admin@matchmyformation.com",
              avatar: "/admin-avatar.png",
            },
            is_free: true,
            price: 0,
            rating: 0,
            views: video.students_count || 0,
            likes: Math.floor((video.students_count || 0) * 0.8),
            comments: [],
            visibility: "public",
          }))
        : Array.isArray(data?.data)
          ? data.data.map((video: any) => ({
              ...video,
              is_admin_video: true,
              id: video.id,
              title: video.title || "Vidéo Admin",
              description: video.description || "",
              thumbnail:
                video.thumbnail || video.image || "/placeholder-course.jpg",
              duration: video.duration || "00:00",
              video_url: video.video_url || "",
              category: video.category || "Formation",
              tags: video.tags || [],
              is_published: video.is_published ?? true,
              created_at: video.created_at || new Date().toISOString(),
              creator: {
                id: 0,
                name: "Admin",
                email: "admin@matchmyformation.com",
                avatar: "/admin-avatar.png",
              },
              is_free: true,
              price: 0,
              rating: 0,
              views: video.students_count || 0,
              likes: Math.floor((video.students_count || 0) * 0.8),
              comments: [],
              visibility: "public",
            }))
          : [];

      return NextResponse.json({
        success: true,
        data: adminVideos,
      });
    } else {
      // En cas d'erreur, retourner des données de démonstration
      const demoAdminVideos = [
        {
          id: 1,
          title: "Formation Admin - Introduction",
          description: "Vidéo d'introduction créée par l'administrateur",
          thumbnail: "/placeholder-course.jpg",
          duration: "10:00",
          video_url: "",
          category: "Formation",
          tags: ["admin", "introduction"],
          is_published: true,
          created_at: new Date().toISOString(),
          creator: {
            id: 0,
            name: "Admin",
            email: "admin@matchmyformation.com",
            avatar: "/admin-avatar.png",
          },
          is_free: true,
          price: 0,
          rating: 0,
          views: 100,
          likes: 85,
          comments: [],
          visibility: "public",
          is_admin_video: true,
        },
      ];

      return NextResponse.json({
        success: true,
        data: demoAdminVideos,
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos admin publiques:",
      error
    );

    // Retourner des données de démonstration en cas d'erreur
    const demoAdminVideos = [
      {
        id: 1,
        title: "Formation Admin - Introduction",
        description: "Vidéo d'introduction créée par l'administrateur",
        thumbnail: "/placeholder-course.jpg",
        duration: "10:00",
        video_url: "",
        category: "Formation",
        tags: ["admin", "introduction"],
        is_published: true,
        created_at: new Date().toISOString(),
        creator: {
          id: 0,
          name: "Admin",
          email: "admin@matchmyformation.com",
          avatar: "/admin-avatar.png",
        },
        is_free: true,
        price: 0,
        rating: 0,
        views: 100,
        likes: 85,
        comments: [],
        visibility: "public",
        is_admin_video: true,
      },
    ];

    return NextResponse.json({
      success: true,
      data: demoAdminVideos,
    });
  }
}
