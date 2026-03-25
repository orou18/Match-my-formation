// Base de données partagée pour les vidéos - accessible par toutes les APIs
let sharedVideoData: any[] = [
  {
    id: '1',
    title: "Introduction au Tourisme Durable",
    description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables pour un avenir responsable.",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "12:34",
    order: 1,
    creator_id: 1,
    views: 15420,
    likes: 892,
    comments: [
      {
        id: '1',
        user_id: 2,
        user_name: "Marie Laurent",
        user_avatar: "/temoignage.png",
        content: "Excellent contenu ! Très bien expliqué.",
        created_at: "2024-03-15T10:30:00Z",
        likes: 12
      }
    ],
    tags: ["tourisme", "durable", "ecologie"],
    is_published: true,
    visibility: "public",
    learning_objectives: [
      "Comprendre les principes du tourisme durable",
      "Identifier les pratiques écologiques",
      "Appliquer les normes de durabilité"
    ],
    resources: [
      {
        id: '1',
        title: "Guide du Tourisme Durable",
        type: "pdf",
        url: "/resources/guide-tourisme-durable.pdf",
        description: "Guide complet sur les pratiques durables",
        file_size: 2048576,
        created_at: "2024-03-15T09:00:00Z"
      }
    ],
    created_at: "2024-03-15T08:00:00Z",
    updated_at: "2024-03-15T08:00:00Z"
  },
  {
    id: '2',
    title: "Gestion Hôtelière Avancée",
    description: "Techniques avancées de gestion hôtelière pour les professionnels du secteur.",
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
      "Gérer les équipes efficacement"
    ],
    resources: [],
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z"
  }
];

export class SharedVideoData {
  static getAllVideos() {
    return sharedVideoData;
  }
  
  static addVideo(video: any) {
    console.log('🎬 SharedVideoData - Ajout vidéo:', video.title);
    sharedVideoData.push(video);
    console.log('🎬 SharedVideoData - Total vidéos:', sharedVideoData.length);
  }
  
  static getPublicVideos() {
    return sharedVideoData.filter(video => 
      video.visibility === 'public' && video.is_published === true
    );
  }
  
  static getCreatorVideos(creatorId: number) {
    return sharedVideoData.filter(video => video.creator_id === creatorId);
  }
  
  static updateVideo(id: string, updates: any) {
    const index = sharedVideoData.findIndex(v => v.id === id);
    if (index !== -1) {
      sharedVideoData[index] = { ...sharedVideoData[index], ...updates };
    }
  }
  
  static deleteVideo(id: string) {
    sharedVideoData = sharedVideoData.filter(v => v.id !== id);
  }
  
  static getVideoById(id: string) {
    return sharedVideoData.find(v => v.id === id);
  }
}
