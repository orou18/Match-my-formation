// Types pour l'écosystème Match My Formation

// Types Utilisateurs
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'creator' | 'admin';
  avatar?: string;
  subscription?: string;
  level?: number;
  points?: number;
  created_at: string;
  updated_at: string;
}

export interface Student extends User {
  role: 'student';
  enrolled_courses: number;
  completed_courses: number;
  certificates: Certificate[];
  progress: CourseProgress[];
}

export interface Creator extends User {
  role: 'creator';
  specialty: string;
  total_videos: number;
  total_views: number;
  total_revenue: number;
  subscribers: number;
  videos: Video[];
}

// Types Cours et Formations
export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: Category;
  creator: Creator;
  modules: Module[];
  enrolled_students: number;
  rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  course_id: number;
  order: number;
  videos: Video[];
  duration: number;
  is_published: boolean;
}

// Types pour les ressources associées aux vidéos
export interface VideoResource {
  id: number;
  video_id: number;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  description?: string;
  created_at: string;
}

// Types pour les objectifs d'apprentissage
export interface LearningObjective {
  id: number;
  video_id: number;
  title: string;
  description: string;
  order: number;
  is_completed?: boolean;
}

// Types pour les chapitres/modules de vidéos
export interface VideoChapter {
  id: number;
  video_id: number;
  title: string;
  description: string;
  order: number;
  videos: Video[];
}

// Types pour les playlists/collections de cours
export interface Playlist {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  videos: Video[];
  is_public: boolean;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  order: number;
  module_id?: number;
  creator_id: number;
  views: number;
  likes: number;
  comments: Comment[];
  tags: string[];
  is_published: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  updated_at: string;
  // Nouvelles propriétés pour le flux complet
  learning_objectives?: LearningObjective[];
  resources?: VideoResource[];
  creator?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    specialty?: string;
  };
  playlist?: Playlist;
  price?: number;
  is_free?: boolean;
  rating?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  courses_count: number;
}

// Types Progression et Certificats
export interface CourseProgress {
  id: number;
  user_id: number;
  course_id: number;
  completed_modules: number;
  total_modules: number;
  completed_videos: number;
  total_videos: number;
  progress_percentage: number;
  last_accessed: string;
  completed_at?: string;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_url: string;
  issued_at: string;
  verification_code: string;
}

// Types Notifications et Messages
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  video_id: number;
  user_id: number;
  content: string;
  likes: number;
  replies: Comment[];
  created_at: string;
  updated_at: string;
}

// Types Analytics et Statistiques
export interface DashboardStats {
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_revenue: number;
  recent_videos: Video[];
  performance_data: number[];
}

export interface RevenueData {
  month: string;
  revenue: number;
  subscribers: number;
  views: number;
}

export interface AnalyticsData {
  views: number;
  unique_viewers: number;
  watch_time: number;
  engagement_rate: number;
  revenue: number;
  period: string;
}

// Types pour les formulaires
export interface VideoUploadData {
  title: string;
  description: string;
  thumbnail: File;
  video_file: File;
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  category_id?: number;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatar?: File;
  bio?: string;
  specialty?: string;
  social_links?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Types pour les erreurs
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
}

// Types pour les cours premium prédéfinis
export interface PremiumCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  thumbnail: string;
  banner: string;
  price: number;
  original_price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'luxe' | 'ecotourisme' | 'digital' | 'revenue';
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
    expertise: string[];
  };
  modules: {
    title: string;
    lessons: {
      title: string;
      duration: string;
      type: 'video' | 'reading' | 'exercise';
    }[];
  }[];
  features: string[];
  certification: boolean;
  language: string;
  rating: number;
  reviews_count: number;
  enrolled_count: number;
  is_featured: boolean;
  created_at: string;
}

export default {};
