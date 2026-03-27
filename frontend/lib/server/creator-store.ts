import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";
import {
  findAccountById,
  getUserNotifications,
  saveUserNotifications,
} from "@/lib/server/account-store";
import { VideoStore } from "@/lib/video-store";
import { getCreatorPathways } from "@/lib/server/learning-store";

export type CreatorDashboardSettings = {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardStyle: "modern" | "classic" | "minimal";
  };
  layout: {
    sidebarPosition: "left" | "right";
    showStats: boolean;
    showQuickActions: boolean;
    defaultView: "grid" | "list";
  };
  widgets: {
    showRecentVideos: boolean;
    showTopEmployees: boolean;
    showActivity: boolean;
    showRevenue: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
  };
};

export type CreatorNotification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
};

export type CreatorHistoryItem = {
  id: string;
  type: "enrollment" | "payment" | "video_upload" | "course_update" | "refund";
  title: string;
  description: string;
  amount?: number;
  studentName?: string;
  videoTitle?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "processing";
  metadata?: {
    videoId?: string;
    studentId?: string;
    transactionId?: string;
  };
};

const DEFAULT_SETTINGS: CreatorDashboardSettings = {
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#F9FAFB",
    cardStyle: "modern",
  },
  layout: {
    sidebarPosition: "left",
    showStats: true,
    showQuickActions: true,
    defaultView: "grid",
  },
  widgets: {
    showRecentVideos: true,
    showTopEmployees: true,
    showActivity: true,
    showRevenue: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
  },
};

type CreatorSettingsStore = Record<string, CreatorDashboardSettings>;

function getSettingsStore() {
  return readJsonStore<CreatorSettingsStore>(
    "creator-dashboard-settings.json",
    {}
  );
}

function saveSettingsStore(store: CreatorSettingsStore) {
  return writeJsonStore("creator-dashboard-settings.json", store);
}

export function getCreatorSettings(userId: string) {
  const store = getSettingsStore();
  if (!store[userId]) {
    store[userId] = DEFAULT_SETTINGS;
    saveSettingsStore(store);
  }
  return store[userId];
}

export function updateCreatorSettings(
  userId: string,
  updates: Partial<CreatorDashboardSettings>
) {
  const current = getCreatorSettings(userId);
  const nextSettings: CreatorDashboardSettings = {
    theme: { ...current.theme, ...(updates.theme || {}) },
    layout: { ...current.layout, ...(updates.layout || {}) },
    widgets: { ...current.widgets, ...(updates.widgets || {}) },
    notifications: {
      ...current.notifications,
      ...(updates.notifications || {}),
    },
  };

  const store = getSettingsStore();
  store[userId] = nextSettings;
  saveSettingsStore(store);
  return nextSettings;
}

export function getCreatorVideos(creatorId: string) {
  const normalizedId = Number(creatorId) || 2;
  return VideoStore.getVideos().filter(
    (video) => Number(video.creator_id) === normalizedId
  );
}

export function getCreatorStats(creatorId: string) {
  const videos = getCreatorVideos(creatorId);
  const account = findAccountById(creatorId);
  const viewsSeries = videos
    .slice(0, 7)
    .map((video) => Number(video.views || 0));
  const revenueSeries = videos
    .slice(0, 7)
    .map((video) => Number(video.revenue || 0));

  return {
    totalViews: videos.reduce(
      (sum, video) => sum + Number(video.views || 0),
      0
    ),
    totalStudents: videos.reduce(
      (sum, video) => sum + Number(video.students || 0),
      0
    ),
    totalRevenue: videos.reduce(
      (sum, video) => sum + Number(video.revenue || 0),
      0
    ),
    totalVideos: videos.length,
    monthlyViews: viewsSeries.length ? viewsSeries : [0, 0, 0, 0, 0, 0, 0],
    monthlyRevenue: revenueSeries.length
      ? revenueSeries
      : [0, 0, 0, 0, 0, 0, 0],
    topVideos: [...videos]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5)
      .map((video) => ({
        id: String(video.id),
        title: String(video.title || "Vidéo"),
        views: Number(video.views || 0),
        revenue: Number(video.revenue || 0),
        students: Number(video.students || 0),
      })),
    recentActivity: [...videos]
      .sort(
        (a, b) =>
          new Date(
            String(b.updatedAt || b.updated_at || b.created_at)
          ).getTime() -
          new Date(
            String(a.updatedAt || a.updated_at || a.created_at)
          ).getTime()
      )
      .slice(0, 5)
      .map((video) => ({
        id: `video-${video.id}`,
        type: Number(video.revenue || 0) > 0 ? "revenue" : "view",
        title: `${video.title} ${Number(video.revenue || 0) > 0 ? "génère des revenus" : "est consultée"}`,
        timestamp: String(
          video.updatedAt || video.updated_at || video.created_at
        ),
        amount: Number(video.revenue || 0) || undefined,
      })),
    creatorName: account?.name || "Créateur",
  };
}

export function getCreatorHistory(creatorId: string): CreatorHistoryItem[] {
  const videos = getCreatorVideos(creatorId);
  const pathways = getCreatorPathways();

  const videoEvents: CreatorHistoryItem[] = videos.flatMap((video) => {
    const createdAt = String(
      video.createdAt || video.created_at || new Date().toISOString()
    );
    const updatedAt = String(video.updatedAt || video.updated_at || createdAt);
    return [
      {
        id: `video-upload-${video.id}`,
        type: "video_upload",
        title: "Vidéo publiée",
        description: `La vidéo "${video.title}" a été ajoutée à votre catalogue`,
        videoTitle: String(video.title || ""),
        timestamp: createdAt,
        status: "completed",
        metadata: { videoId: String(video.id) },
      },
      {
        id: `video-update-${video.id}`,
        type: "course_update",
        title: "Vidéo mise à jour",
        description: `Le contenu "${video.title}" a été modifié`,
        videoTitle: String(video.title || ""),
        timestamp: updatedAt,
        status: "completed",
        metadata: { videoId: String(video.id) },
      },
      {
        id: `payment-${video.id}`,
        type: "payment",
        title: "Revenus enregistrés",
        description: `Les inscriptions liées à "${video.title}" ont généré des revenus`,
        amount: Number(video.revenue || 0),
        timestamp: updatedAt,
        status: Number(video.revenue || 0) > 0 ? "completed" : "pending",
        metadata: { transactionId: `txn-${video.id}` },
      },
    ];
  });

  const pathwayEvents: CreatorHistoryItem[] = pathways.map((pathway) => ({
    id: `pathway-${pathway.id}`,
    type: "enrollment",
    title: "Parcours assigné",
    description: `Le parcours "${pathway.title}" est actif pour ${pathway.assigned_employees} employé(s)`,
    timestamp: pathway.created_at,
    status: pathway.is_active ? "completed" : "processing",
    metadata: { videoId: String(pathway.id) },
  }));

  return [...videoEvents, ...pathwayEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getCreatorNotifications(userId: string): CreatorNotification[] {
  const notifications = getUserNotifications(userId, "creator");
  if (
    notifications.length === 1 &&
    notifications[0]?.title?.startsWith("Bienvenue")
  ) {
    const creatorVideos = getCreatorVideos(userId);
    const enriched = [
      {
        id: `${userId}-creator-1`,
        userId,
        title: "Votre espace créateur est actif",
        message:
          "Vous pouvez publier des vidéos, suivre vos statistiques et gérer votre marque blanche.",
        type: "success" as const,
        category: "system" as const,
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/dashboard/creator",
      },
      ...creatorVideos.slice(0, 2).map((video, index) => ({
        id: `${userId}-creator-${index + 2}`,
        userId,
        title: "Contenu disponible",
        message: `La vidéo "${video.title}" est disponible dans votre catalogue créateur.`,
        type: "info" as const,
        category: "course" as const,
        isRead: index > 0,
        createdAt: String(
          video.updatedAt || video.updated_at || video.created_at
        ),
        actionUrl: "/dashboard/creator/videos",
      })),
    ];
    saveUserNotifications(userId, enriched);
    return getCreatorNotifications(userId);
  }

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: notification.createdAt,
    read: notification.isRead,
    action: notification.actionUrl
      ? {
          label: "Ouvrir",
          url: notification.actionUrl,
        }
      : undefined,
  }));
}

export function saveCreatorNotifications(
  userId: string,
  notifications: CreatorNotification[]
) {
  return saveUserNotifications(
    userId,
    notifications.map((notification) => ({
      id: notification.id,
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      category: "system",
      isRead: notification.read,
      createdAt: notification.timestamp,
      actionUrl: notification.action?.url,
    }))
  );
}
