import { writeJsonStore, readJsonStore } from './json-store';

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  comments: any[];
  tags: string[];
  category: string;
  difficulty_level: string;
  language: string;
  is_published: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  is_free: boolean;
  price: number;
  learning_objectives: string[];
  target_audience: string[];
  prerequisites: string[];
  certificate_available: boolean;
  students_count: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface VideosDataStore {
  videos: Video[];
  lastUpdated: string;
}

const VIDEOS_STORE_FILE = 'videos.json';

// Vidéos par défaut pour le seeder
const DEFAULT_VIDEOS: Video[] = [
  {
    id: 1,
    title: "Introduction au Marketing Digital",
    description: "Découvrez les bases du marketing digital et transformez votre stratégie",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "15:30",
    views: 1250,
    likes: 89,
    comments: [],
    tags: ["marketing", "digital", "base"],
    category: "marketing",
    difficulty_level: "beginner",
    language: "fr",
    is_published: true,
    visibility: "public",
    is_free: true,
    price: 0,
    learning_objectives: ["Comprendre les fondamentaux du marketing digital", "Maîtriser les outils essentiels"],
    target_audience: ["Débutants", "Entrepreneurs", "Professionnels du marketing"],
    prerequisites: ["Connaissances de base en marketing"],
    certificate_available: true,
    students_count: 3420,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    creator: {
      id: 1,
      name: "Expert Marketing",
      avatar: "/avatars/default-creator.jpg"
    }
  },
  {
    id: 2,
    title: "Techniques de Vente Avancées",
    description: "Maîtrisez les techniques de vente modernes pour augmenter vos conversions",
    thumbnail: "/videos/video2-thumb.jpg",
    video_url: "/videos/video2.mp4",
    duration: "22:15",
    views: 980,
    likes: 67,
    comments: [],
    tags: ["vente", "techniques", "avancé"],
    category: "sales",
    difficulty_level: "intermediate",
    language: "fr",
    is_published: true,
    visibility: "public",
    is_free: true,
    price: 0,
    learning_objectives: ["Développer des techniques de vente avancées", "Maîtriser la psychologie client"],
    target_audience: ["Commerciaux", "Chef de vente", "Entrepreneurs"],
    prerequisites: ["Expérience en vente"],
    certificate_available: true,
    students_count: 2890,
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-14T14:20:00Z",
    creator: {
      id: 2,
      name: "Expert Commercial",
      avatar: "/avatars/default-creator.jpg"
    }
  },
  {
    id: 3,
    title: "Gestion de la Relation Client",
    description: "Apprenez à fidéliser vos clients et à gérer efficacement la relation client",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "18:45",
    views: 756,
    likes: 45,
    comments: [],
    tags: ["client", "relation", "fidélisation"],
    category: "customer-service",
    difficulty_level: "intermediate",
    language: "fr",
    is_published: true,
    visibility: "public",
    is_free: true,
    price: 0,
    learning_objectives: ["Comprendre la relation client", "Développer des stratégies de fidélisation"],
    target_audience: ["Service client", "Commerciaux", "Managers"],
    prerequisites: ["Expérience client"],
    certificate_available: true,
    students_count: 2156,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    creator: {
      id: 3,
      name: "Expert Service Client",
      avatar: "/avatars/default-creator.jpg"
    }
  }
];

class VideosStore {
  private static instance: VideosStore;
  private videos: Video[] = [];
  private nextId: number = 4; // Commence après les vidéos par défaut

  private constructor() {
    this.loadVideos();
  }

  public static getInstance(): VideosStore {
    if (!VideosStore.instance) {
      VideosStore.instance = new VideosStore();
    }
    return VideosStore.instance;
  }

  private async loadVideos(): Promise<void> {
    try {
      const store = await readJsonStore<VideosStore>(VIDEOS_STORE_FILE);
      
      if (store && store.videos && store.videos.length > 0) {
        this.videos = store.videos;
        // Trouver le prochain ID
        this.nextId = Math.max(...this.videos.map(v => v.id)) + 1;
      } else {
        // Utiliser les vidéos par défaut pour le seeder
        this.videos = [...DEFAULT_VIDEOS];
        await this.saveVideos();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
      this.videos = [...DEFAULT_VIDEOS];
    }
  }

  private async saveVideos(): Promise<void> {
    try {
      const store: VideosDataStore = {
        videos: this.videos,
        lastUpdated: new Date().toISOString()
      };
      await writeJsonStore(VIDEOS_STORE_FILE, store);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des vidéos:', error);
    }
  }

  // Obtenir toutes les vidéos
  public async getAllVideos(): Promise<Video[]> {
    return [...this.videos];
  }

  // Obtenir les vidéos d'un créateur spécifique
  public async getCreatorVideos(creatorId: number): Promise<Video[]> {
    return this.videos.filter(video => video.creator.id === creatorId);
  }

  // Obtenir les vidéos publiques (pour les étudiants)
  public async getPublicVideos(): Promise<Video[]> {
    return this.videos.filter(video => 
      video.is_published && video.visibility === 'public'
    );
  }

  // Créer une nouvelle vidéo
  public async createVideo(videoData: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments' | 'students_count'>): Promise<Video> {
    const newVideo: Video = {
      ...videoData,
      id: this.nextId++,
      views: 0,
      likes: 0,
      comments: [],
      students_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.videos.unshift(newVideo); // Ajouter au début
    await this.saveVideos();
    
    return newVideo;
  }

  // Mettre à jour une vidéo
  public async updateVideo(id: number, updates: Partial<Video>): Promise<Video | null> {
    const videoIndex = this.videos.findIndex(v => v.id === id);
    
    if (videoIndex === -1) {
      return null;
    }

    this.videos[videoIndex] = {
      ...this.videos[videoIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.saveVideos();
    return this.videos[videoIndex];
  }

  // Supprimer une vidéo
  public async deleteVideo(id: number): Promise<boolean> {
    const videoIndex = this.videos.findIndex(v => v.id === id);
    
    if (videoIndex === -1) {
      return false;
    }

    this.videos.splice(videoIndex, 1);
    await this.saveVideos();
    return true;
  }

  // Publier une vidéo (changer sa visibilité)
  public async publishVideo(id: number): Promise<Video | null> {
    return this.updateVideo(id, { 
      is_published: true, 
      visibility: 'public' 
    });
  }

  // Rendre une vidéo privée
  public async unpublishVideo(id: number): Promise<Video | null> {
    return this.updateVideo(id, { 
      is_published: false, 
      visibility: 'private' 
    });
  }

  // Obtenir une vidéo par son ID
  public async getVideoById(id: number): Promise<Video | null> {
    return this.videos.find(v => v.id === id) || null;
  }

  // Rechercher des vidéos
  public async searchVideos(query: string, filters?: {
    category?: string;
    difficulty?: string;
    visibility?: string;
  }): Promise<Video[]> {
    let filteredVideos = [...this.videos];

    // Filtrer par recherche textuelle
    if (query) {
      const searchLower = query.toLowerCase();
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Appliquer les filtres
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filteredVideos = filteredVideos.filter(video => video.category === filters.category);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredVideos = filteredVideos.filter(video => video.difficulty_level === filters.difficulty);
      }
      if (filters.visibility && filters.visibility !== 'all') {
        filteredVideos = filteredVideos.filter(video => video.visibility === filters.visibility);
      }
    }

    return filteredVideos;
  }

  // Obtenir les statistiques
  public async getStats(): Promise<{
    total: number;
    published: number;
    public: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const total = this.videos.length;
    const published = this.videos.filter(v => v.is_published).length;
    const publicVideos = this.videos.filter(v => v.is_published && v.visibility === 'public').length;
    const totalViews = this.videos.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = this.videos.reduce((sum, v) => sum + v.likes, 0);

    return {
      total,
      published,
      public: publicVideos,
      totalViews,
      totalLikes
    };
  }
}

// Exporter une instance singleton
export const videosStore = VideosStore.getInstance();
