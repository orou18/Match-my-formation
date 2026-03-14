// Configuration de l'API pour la communication entre frontend et backend
export const API_CONFIG = {
  // URL de base de l'API backend
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://matchmyformation-e-learning.com.matchmyformation.com/api',
  
  // URL de l'application frontend
  appURL: process.env.NEXT_PUBLIC_APP_URL || 'https://matchmyformation-e-learning.com.matchmyformation.com',
  
  // Timeout des requêtes
  timeout: 30000,
  
  // Taille des chunks pour l'upload
  chunkSize: 1024 * 1024, // 1MB
  
  // Configuration des retries
  maxRetries: 3,
  retryDelay: 1000, // 1 seconde
  
  // Configuration des headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  
  // Configuration des endpoints
  endpoints: {
    // Authentification
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      me: '/auth/me',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    
    // Utilisateurs
    users: {
      profile: '/users/profile',
      update: '/users/update',
      avatar: '/users/avatar',
      password: '/users/password',
      preferences: '/users/preferences',
    },
    
    // Vidéos
    videos: {
      list: '/videos',
      create: '/videos',
      update: '/videos/:id',
      delete: '/videos/:id',
      upload: '/videos/upload',
      thumbnail: '/videos/:id/thumbnail',
      like: '/videos/:id/like',
      comment: '/videos/:id/comment',
      share: '/videos/:id/share',
    },
    
    // Playlists
    playlists: {
      list: '/playlists',
      create: '/playlists',
      update: '/playlists/:id',
      delete: '/playlists/:id',
      addVideo: '/playlists/:id/add-video',
      removeVideo: '/playlists/:id/remove-video',
    },
    
    // Dashboard Creator
    creator: {
      stats: '/creator/stats',
      revenue: '/creator/revenue',
      audience: '/creator/audience',
      engagement: '/creator/engagement',
      comments: '/creator/comments',
      shares: '/creator/shares',
      library: '/creator/library',
      media: '/creator/media',
      schedule: '/creator/schedule',
    },
    
    // Dashboard Admin
    admin: {
      users: '/admin/users',
      videos: '/admin/videos',
      revenue: '/admin/revenue',
      settings: '/admin/settings',
      analytics: '/admin/analytics',
      blog: '/admin/blog',
      newsletter: '/admin/newsletter',
    },
    
    // Upload
    upload: {
      video: '/upload/video',
      image: '/upload/image',
      document: '/upload/document',
      chunk: '/upload/chunk',
    },
    
    // Notifications
    notifications: {
      list: '/notifications',
      read: '/notifications/:id/read',
      settings: '/notifications/settings',
    },
    
    // Recherche
    search: {
      videos: '/search/videos',
      users: '/search/users',
      playlists: '/search/playlists',
    },
    
    // Health check
    health: '/health',
  },
  
  // Configuration des erreurs
  errors: {
    networkError: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    timeoutError: 'La requête a expiré. Veuillez réessayer.',
    unauthorizedError: 'Non autorisé. Veuillez vous connecter.',
    forbiddenError: 'Accès refusé.',
    notFoundError: 'Ressource non trouvée.',
    serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
    validationError: 'Erreur de validation. Veuillez vérifier vos données.',
  },
  
  // Configuration des tentatives
  retry: {
    attempts: 3,
    delay: 1000,
  },
  
  // Configuration du cache
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Configuration pour les uploads
export const UPLOAD_CONFIG = {
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '2048000'), // 2MB
  allowedVideoTypes: (process.env.NEXT_PUBLIC_ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm,video/ogg,video/quicktime').split(','),
  allowedImageTypes: (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  chunkSize: 1024 * 1024, // 1MB
  maxRetries: 3,
  retryDelay: 2000,
};

// Configuration pour WebSocket (si nécessaire)
export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'wss://matchmyformation-e-learning.com.matchmyformation.com/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
};

export default API_CONFIG;
