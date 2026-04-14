import { NextRequest, NextResponse } from "next/server";
import { videosStore } from "@/lib/store/videos-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const creatorId = searchParams.get("creatorId");
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    let videos = [];

    switch (type) {
      case "public":
        videos = await videosStore.getPublicVideos();
        break;
      case "creator":
        if (creatorId) {
          videos = await videosStore.getCreatorVideos(parseInt(creatorId));
        } else {
          return NextResponse.json(
            {
              error: "creatorId requis pour le type 'creator'",
            },
            { status: 400 }
          );
        }
        break;
      case "all":
      default:
        videos = await videosStore.getAllVideos();
        break;
    }

    // Appliquer les filtres de recherche si nécessaires
    if (query || category || difficulty) {
      videos = await videosStore.searchVideos(query, {
        category: category || "all",
        difficulty: difficulty || "all",
      });
    }

    return NextResponse.json({
      success: true,
      videos,
      total: videos.length,
      type,
      filters: {
        query,
        category,
        difficulty,
      },
    });
  } catch (error) {
    console.error("VIDEOS STORE GET - Error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des vidéos",
        videos: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, videoData, videoId, updates } = body;

    switch (action) {
      case "create":
        if (!videoData) {
          return NextResponse.json(
            {
              error: "videoData requis pour la création",
            },
            { status: 400 }
          );
        }
        const newVideo = await videosStore.createVideo(videoData);
        return NextResponse.json(
          {
            success: true,
            message: "Vidéo créée avec succès",
            data: newVideo,
          },
          { status: 201 }
        );

      case "update":
        if (!videoId || !updates) {
          return NextResponse.json(
            {
              error: "videoId et updates requis pour la mise à jour",
            },
            { status: 400 }
          );
        }
        const updatedVideo = await videosStore.updateVideo(
          parseInt(videoId),
          updates
        );
        if (!updatedVideo) {
          return NextResponse.json(
            {
              error: "Vidéo non trouvée",
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Vidéo mise à jour avec succès",
          data: updatedVideo,
        });

      case "delete":
        if (!videoId) {
          return NextResponse.json(
            {
              error: "videoId requis pour la suppression",
            },
            { status: 400 }
          );
        }
        const deleted = await videosStore.deleteVideo(parseInt(videoId));
        if (!deleted) {
          return NextResponse.json(
            {
              error: "Vidéo non trouvée",
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Vidéo supprimée avec succès",
        });

      case "publish":
        if (!videoId) {
          return NextResponse.json(
            {
              error: "videoId requis pour la publication",
            },
            { status: 400 }
          );
        }
        const publishedVideo = await videosStore.publishVideo(
          parseInt(videoId)
        );
        if (!publishedVideo) {
          return NextResponse.json(
            {
              error: "Vidéo non trouvée",
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Vidéo publiée avec succès",
          data: publishedVideo,
        });

      case "unpublish":
        if (!videoId) {
          return NextResponse.json(
            {
              error: "videoId requis pour la dépublication",
            },
            { status: 400 }
          );
        }
        const unpublishedVideo = await videosStore.unpublishVideo(
          parseInt(videoId)
        );
        if (!unpublishedVideo) {
          return NextResponse.json(
            {
              error: "Vidéo non trouvée",
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Vidéo dépubliée avec succès",
          data: unpublishedVideo,
        });

      default:
        return NextResponse.json(
          {
            error: "Action non valide",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("VIDEOS STORE POST - Error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'opération sur les vidéos",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json(
        {
          error: "ID vidéo requis",
        },
        { status: 400 }
      );
    }

    const updates = await request.json();
    const updatedVideo = await videosStore.updateVideo(
      parseInt(videoId),
      updates
    );

    if (!updatedVideo) {
      return NextResponse.json(
        {
          error: "Vidéo non trouvée",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vidéo mise à jour avec succès",
      data: updatedVideo,
    });
  } catch (error) {
    console.error("VIDEOS STORE PUT - Error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour de la vidéo",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json(
        {
          error: "ID vidéo requis",
        },
        { status: 400 }
      );
    }

    const deleted = await videosStore.deleteVideo(parseInt(videoId));

    if (!deleted) {
      return NextResponse.json(
        {
          error: "Vidéo non trouvée",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vidéo supprimée avec succès",
    });
  } catch (error) {
    console.error("VIDEOS STORE DELETE - Error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la suppression de la vidéo",
        success: false,
      },
      { status: 500 }
    );
  }
}
