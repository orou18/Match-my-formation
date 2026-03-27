export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  order: number;
  creator_id: number;
  views: number;
  likes: number;
  comments: Comment[];
  tags: string[];
  is_published: boolean;
  visibility: "public" | "private" | "unlisted";
  learning_objectives?: string[];
  resources?: Resource[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id?: string;
  title: string;
  type: "pdf" | "link" | "document" | "image" | "video" | "audio";
  url: string;
  description?: string;
  file_size?: number;
  file_data?: File; // Pour l'upload
  created_at?: string;
}

export interface Comment {
  id: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
  likes: number;
}

export interface VideoFormData {
  title: string;
  description: string;
  category: string;
  learning_objectives: string[];
  resources: Omit<Resource, "id" | "created_at">[];
  video_file?: File;
  thumbnail?: File;
  visibility: "public" | "private" | "unlisted";
  allow_comments: boolean;
  publish_immediately: boolean;
  tags: string[];
  video_url?: string;
  thumbnail_url?: string;
}

export interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  engagement: number;
  revenue: number;
}
