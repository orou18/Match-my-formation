import { api } from './config';
import type { Video, VideoUploadData } from '@/types';

export class VideoService {
  // Upload une vidéo avec FormData
  static async uploadVideo(data: VideoUploadData): Promise<Video> {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('visibility', data.visibility);
    
    if (data.category_id) {
      formData.append('category_id', data.category_id.toString());
    }
    
    // Ajouter les fichiers
    formData.append('thumbnail', data.thumbnail);
    formData.append('video_file', data.video_file);

    try {
      const response = await api.upload<Video>('/api/creator/videos/upload', formData);
      return response;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  // Récupérer toutes les vidéos du créateur
  static async getCreatorVideos(): Promise<Video[]> {
    try {
      const response = await api.get<Video[]>('/api/creator/videos');
      return response;
    } catch (error) {
      console.error('Error fetching creator videos:', error);
      throw error;
    }
  }

  // Récupérer une vidéo spécifique
  static async getVideoById(id: number): Promise<Video> {
    try {
      const response = await api.get<Video>(`/api/creator/videos/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  // Mettre à jour une vidéo
  static async updateVideo(id: number, data: Partial<VideoUploadData>): Promise<Video> {
    try {
      const response = await api.put<Video>(`/api/creator/videos/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  // Supprimer une vidéo
  static async deleteVideo(id: number): Promise<void> {
    try {
      await api.delete(`/api/creator/videos/${id}`);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  // Publier/Dépublier une vidéo
  static async togglePublishStatus(id: number, isPublished: boolean): Promise<Video> {
    try {
      const response = await api.patch<Video>(`/api/creator/videos/${id}/publish`, {
        is_published: isPublished
      });
      return response;
    } catch (error) {
      console.error('Error toggling publish status:', error);
      throw error;
    }
  }

  // Récupérer les statistiques d'une vidéo
  static async getVideoStats(id: number): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
    revenue: number;
  }> {
    try {
      const response = await api.get<{
        views: number;
        likes: number;
        comments: number;
        shares: number;
        revenue: number;
      }>(`/api/creator/videos/${id}/stats`);
      return response;
    } catch (error) {
      console.error('Error fetching video stats:', error);
      throw error;
    }
  }

  // Récupérer les vidéos pour les étudiants
  static async getStudentVideos(filters?: {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    videos: Video[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    try {
      const response = await api.get<{
        videos: Video[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/api/student/videos?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching student videos:', error);
      throw error;
    }
  }

  // Incrementer les vues d'une vidéo
  static async incrementViews(id: number): Promise<void> {
    try {
      await api.post(`/api/videos/${id}/views`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Ne pas lancer d'erreur pour ne pas bloquer l'expérience utilisateur
    }
  }

  // Liker une vidéo
  static async likeVideo(id: number): Promise<void> {
    try {
      await api.post(`/api/videos/${id}/like`);
    } catch (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  }

  // Commenter une vidéo
  static async commentVideo(id: number, content: string): Promise<{
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
  }> {
    try {
      const response = await api.post<{
        id: number;
        content: string;
        created_at: string;
        user: {
          id: number;
          name: string;
        };
      }>(`/api/videos/${id}/comments`, {
        content
      });
      return response;
    } catch (error) {
      console.error('Error commenting video:', error);
      throw error;
    }
  }

  // Partager une vidéo
  static async shareVideo(id: number, platform: string): Promise<void> {
    try {
      await api.post(`/api/videos/${id}/share`, { platform });
    } catch (error) {
      console.error('Error sharing video:', error);
      throw error;
    }
  }
}

export default VideoService;
