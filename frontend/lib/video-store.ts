import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

const DEFAULT_VIDEOS: any[] = [
  {
    id: "1",
    title: "Introduction au Tourisme Durable",
    description:
      "Découvrez les fondamentaux du tourisme écologique et les pratiques durables pour un avenir responsable.",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
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
    video_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
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

export class VideoStore {
  static getVideos() {
    return readJsonStore("videos.json", DEFAULT_VIDEOS);
  }

  static addVideo(video: any) {
    console.log("📹 VideoStore - Ajout vidéo:", video.title);
    const videos = this.getVideos();
    videos.push(video);
    writeJsonStore("videos.json", videos);
  }

  static getPublicVideos() {
    return this.getVideos().filter(
      (video) => video.visibility === "public" && video.is_published === true
    );
  }

  static updateVideo(id: string, updates: any) {
    const videoStore = this.getVideos();
    const index = videoStore.findIndex((v) => v.id === id);
    if (index !== -1) {
      videoStore[index] = { ...videoStore[index], ...updates };
      writeJsonStore("videos.json", videoStore);
    }
  }

  static deleteVideo(id: string) {
    writeJsonStore(
      "videos.json",
      this.getVideos().filter((v) => v.id !== id)
    );
  }
}
