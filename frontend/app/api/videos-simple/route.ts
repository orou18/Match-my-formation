import { NextRequest, NextResponse } from "next/server";

// Base de données simple pour les vidéos
let videosDB: any[] = [
  {
    id: "1",
    title: "Introduction au Tourisme Durable",
    description:
      "Découvrez les fondamentaux du tourisme écologique et les pratiques durables pour un avenir responsable.",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "12:34",
    order: 1,
    creator_id: 1,
    views: 15420,
    likes: 892,
    comments: [
      {
        id: "1",
        user_id: 2,
        user_name: "Marie Laurent",
        user_avatar: "/temoignage.png",
        content: "Excellent contenu ! Très bien expliqué.",
        created_at: "2024-03-15T10:30:00Z",
        likes: 12,
      },
    ],
    tags: ["tourisme", "durable", "ecologie"],
    is_published: true,
    visibility: "public",
    learning_objectives: [
      "Comprendre les principes du tourisme durable",
      "Identifier les pratiques écologiques",
      "Appliquer les normes de durabilité",
    ],
    resources: [
      {
        id: "1",
        title: "Guide du Tourisme Durable",
        type: "pdf",
        url: "/resources/guide-tourisme-durable.pdf",
        description: "Guide complet sur les pratiques durables",
        file_size: 2048576,
        created_at: "2024-03-15T09:00:00Z",
      },
    ],
    created_at: "2024-03-15T08:00:00Z",
    updated_at: "2024-03-15T08:00:00Z",
  },
  {
    id: "2",
    title: "Gestion Hôtelière Avancée",
    description:
      "Techniques avancées de gestion hôtelière pour les professionnels du secteur.",
    thumbnail: "/videos/video2-thumb.jpg",
    video_url: "/videos/video2.mp4",
    duration: "45:20",
    order: 2,
    creator_id: 2,
    views: 12350,
    likes: 567,
    comments: [],
    tags: ["hotellerie", "management", "service"],
    is_published: true,
    visibility: "public",
    learning_objectives: [
      "Maîtriser la gestion opérationnelle",
      "Optimiser les processus hôteliers",
      "Gérer les équipes efficacement",
    ],
    resources: [],
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log("VIDEOS SIMPLE - Récupération des vidéos publiques");

    // Filtrer uniquement les vidéos publiques et publiées
    const publicVideos = videosDB.filter(
      (video) => video.visibility === "public" && video.is_published === true
    );

    console.log("VIDEOS SIMPLE - Vidéos trouvées:", publicVideos.length);
    console.log(
      "VIDEOS SIMPLE - Titres:",
      publicVideos.map((v) => v.title)
    );

    return NextResponse.json({
      videos: publicVideos,
      total: publicVideos.length,
    });
  } catch (error) {
    console.error("VIDEOS SIMPLE - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, video } = await request.json();

    if (action === "add") {
      console.log("VIDEOS SIMPLE - Ajout vidéo:", video.title);

      // Ajouter la nouvelle vidéo à la base de données
      videosDB.push(video);

      return NextResponse.json({
        success: true,
        message: "Vidéo ajoutée avec succès",
        video: video,
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("VIDEOS SIMPLE - Erreur POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
