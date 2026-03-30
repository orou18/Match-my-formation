import { getAuthToken } from "./auth-service";

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  video_url?: string;
  duration?: string;
  views: number;
  likes: number;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  video_url?: string;
  thumbnail?: string;
  is_published: boolean;
  learning_objectives?: string[];
  resources?: Array<{
    type: 'link' | 'pdf' | 'document' | 'image' | 'video' | 'audio';
    title: string;
    url?: string;
    file?: File;
    description?: string;
  }>;
}

export interface VideoResponse {
  data: Video[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class VideosService {
  private async getHeaders() {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    };
  }

  // CRUD - CREATE
  async createVideo(videoData: VideoFormData): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos`, {
        method: "POST",
        headers: await this.getHeaders(),
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating video:", error);
      throw error;
    }
  }

  async createVideoWithFormData(formData: FormData): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos`, {
        method: "POST",
        headers: {
          ...(getAuthToken() && { "Authorization": `Bearer ${getAuthToken()}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating video with form data:", error);
      throw error;
    }
  }

  // CRUD - READ
  async getVideos(page = 1, perPage = 12, filters?: {
    category?: string;
    creator_id?: number;
    is_published?: boolean;
  }): Promise<VideoResponse> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = new URL(`${apiBase}/api/videos`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    
    if (filters?.category) {
      url.searchParams.append('category', filters.category);
    }
    if (filters?.creator_id) {
      url.searchParams.append('creator_id', filters.creator_id.toString());
    }
    if (filters?.is_published !== undefined) {
      url.searchParams.append('is_published', filters.is_published.toString());
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async getVideo(id: number): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  }

  async getCreatorVideos(creatorId?: number): Promise<Video[]> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = creatorId 
      ? `${apiBase}/api/creator/${creatorId}/videos`
      : `${apiBase}/api/creator/videos`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching creator videos:", error);
      throw error;
    }
  }

  async getPublicVideos(): Promise<Video[]> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/public`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching public videos:", error);
      throw error;
    }
  }

  // CRUD - UPDATE
  async updateVideo(id: number, videoData: Partial<VideoFormData>): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}`, {
        method: "PUT",
        headers: await this.getHeaders(),
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  }

  async updateVideoWithFormData(id: number, formData: FormData): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}`, {
        method: "POST", // Using POST for FormData compatibility
        headers: {
          ...(getAuthToken() && { "Authorization": `Bearer ${getAuthToken()}` }),
          "X-HTTP-Method-Override": "PUT",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating video with form data:", error);
      throw error;
    }
  }

  // CRUD - DELETE
  async deleteVideo(id: number): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}`, {
        method: "DELETE",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  }

  // Additional CRUD operations
  async toggleVideoPublishStatus(id: number): Promise<Video> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}/toggle-publish`, {
        method: "POST",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling video publish status:", error);
      throw error;
    }
  }

  async likeVideo(id: number): Promise<{ likes: number }> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}/like`, {
        method: "POST",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  }

  async unlikeVideo(id: number): Promise<{ likes: number }> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/videos/${id}/unlike`, {
        method: "POST",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  }

  async searchVideos(query: string, filters?: {
    category?: string;
    creator?: string;
    tags?: string[];
  }): Promise<VideoResponse> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = new URL(`${apiBase}/api/videos/search`);
    url.searchParams.append('q', query);
    
    if (filters?.category) {
      url.searchParams.append('category', filters.category);
    }
    if (filters?.creator) {
      url.searchParams.append('creator', filters.creator);
    }
    if (filters?.tags) {
      filters.tags.forEach(tag => url.searchParams.append('tags[]', tag));
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching videos:", error);
      throw error;
    }
  }
}

export const videosService = new VideosService();
