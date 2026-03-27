import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";
import { getCreatorVideos } from "@/lib/server/creator-store";

export type CreatorComment = {
  id: string;
  user: {
    name: string;
    avatar: string;
    subscribers?: number;
  };
  content: string;
  video: {
    title: string;
    thumbnail: string;
    id: string;
  };
  timestamp: string;
  likes: number;
  replies: number;
  status: "published" | "pending" | "spam" | "deleted";
  sentiment: "positive" | "neutral" | "negative";
  isPinned?: boolean;
};

export type CreatorMediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  thumbnail?: string;
  size: string;
  duration?: string;
  dimensions?: string;
  format: string;
  createdAt: string;
  tags: string[];
  description?: string;
  isFavorite: boolean;
  metadata: {
    resolution?: string;
    bitrate?: string;
    fps?: string;
    codec?: string;
  };
};

export type CreatorLibraryItem = {
  id: string;
  name: string;
  type: "folder" | "video" | "image" | "audio" | "document";
  size?: string;
  duration?: string;
  thumbnail?: string;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  visibility: "public" | "private";
  starred: boolean;
  path: string;
};

export type CreatorScheduleItem = {
  id: string;
  title: string;
  type: "video" | "live" | "premiere";
  thumbnail?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration?: string;
  platform: string[];
  status: "scheduled" | "live" | "completed" | "cancelled";
  visibility: "public" | "private" | "unlisted";
  expectedViews?: number;
  actualViews?: number;
  description?: string;
  tags: string[];
  isRecurring?: boolean;
  recurrencePattern?: string;
  reminders: {
    type: string;
    time: string;
    enabled: boolean;
  }[];
};

function withCreatorScope<T extends { creatorId?: string }>(
  items: T[],
  creatorId: string
) {
  return items.filter((item) => (item.creatorId || "2") === creatorId);
}

function seedComments(creatorId: string): CreatorComment[] {
  const videos = getCreatorVideos(creatorId);
  return videos.slice(0, 4).map((video, index) => ({
    id: `${creatorId}-comment-${index + 1}`,
    user: {
      name:
        ["Marie Dubois", "Jean Martin", "Sophie Laurent", "Pierre Bernard"][
          index
        ] || "Utilisateur",
      avatar: `/avatars/user${index + 1}.jpg`,
      subscribers: [1250, 850, 2100, 320][index] || 0,
    },
    content:
      [
        "Excellent contenu, très clair et directement applicable dans mon travail.",
        "Merci pour cette vidéo, j'aimerais voir plus d'exemples concrets sur le terrain.",
        "Le rythme est très bon et les conseils sont vraiment utiles pour progresser.",
        "Quelques points pourraient être approfondis, mais l'ensemble reste très solide.",
      ][index] || "Très bon contenu.",
    video: {
      title: String(video.title || "Vidéo"),
      thumbnail: String(video.thumbnail || "/videos/video1-thumb.jpg"),
      id: String(video.id),
    },
    timestamp: new Date(
      Date.now() - (index + 1) * 2 * 60 * 60 * 1000
    ).toISOString(),
    likes:
      Number(video.likes || 0) > 0
        ? Math.max(2, Math.round(Number(video.likes || 0) / 20))
        : 4,
    replies: index,
    status: index === 3 ? "pending" : "published",
    sentiment: index === 3 ? "neutral" : "positive",
    isPinned: index === 0,
  }));
}

function seedMedia(creatorId: string): CreatorMediaItem[] {
  const videos = getCreatorVideos(creatorId);
  const mediaFromVideos: CreatorMediaItem[] = videos.map((video, index) => ({
    id: `${creatorId}-media-video-${video.id}`,
    name: String(video.title),
    type: "video",
    url: String(video.video_url),
    thumbnail: String(video.thumbnail || "/videos/video1-thumb.jpg"),
    size: `${180 + index * 40} MB`,
    duration: String(video.duration || "12:00"),
    dimensions: "1920x1080",
    format: "MP4",
    createdAt: String(
      video.created_at || video.updated_at || new Date().toISOString()
    ),
    tags: Array.isArray(video.tags) ? video.tags.map(String) : [],
    description: String(video.description || ""),
    isFavorite: index === 0,
    metadata: {
      resolution: "1920x1080",
      bitrate: "4.5 Mbps",
      fps: "30",
      codec: "H.264",
    },
  }));

  return [
    ...mediaFromVideos,
    {
      id: `${creatorId}-media-image-1`,
      name: "Bannière de formation",
      type: "image",
      url: "/images/banner-promo.jpg",
      size: "856 KB",
      dimensions: "1200x400",
      format: "PNG",
      createdAt: new Date().toISOString(),
      tags: ["branding", "promotion"],
      description: "Bannière utilisée pour la promotion des cours",
      isFavorite: false,
      metadata: {
        resolution: "1200x400",
      },
    },
    {
      id: `${creatorId}-media-doc-1`,
      name: "Guide ressources créateur",
      type: "document",
      url: "/documents/guide-marketing.pdf",
      size: "1.2 MB",
      format: "PDF",
      createdAt: new Date().toISOString(),
      tags: ["guide", "ressources"],
      description: "Guide de support téléchargeable",
      isFavorite: false,
      metadata: {},
    },
  ];
}

function seedLibrary(creatorId: string): CreatorLibraryItem[] {
  const media = seedMedia(creatorId);
  return [
    {
      id: `${creatorId}-library-folder-1`,
      name: "Catalogue créateur",
      type: "folder",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      tags: ["catalogue", "creator"],
      visibility: "public",
      starred: true,
      path: "/creator/catalogue",
    },
    ...media.map((item) => ({
      id: item.id.replace("media", "library"),
      name: item.name,
      type: item.type,
      size: item.size,
      duration: item.duration,
      thumbnail: item.thumbnail || item.url,
      createdAt: item.createdAt,
      modifiedAt: item.createdAt,
      tags: item.tags,
      visibility: "public" as const,
      starred: item.isFavorite,
      path: `/creator/${item.type}/${item.id}`,
    })),
  ];
}

function seedSchedule(creatorId: string): CreatorScheduleItem[] {
  const videos = getCreatorVideos(creatorId);
  return videos.slice(0, 4).map((video, index) => ({
    id: `${creatorId}-schedule-${video.id}`,
    title: String(video.title),
    type: index === 0 ? "premiere" : "video",
    thumbnail: String(video.thumbnail || "/videos/video1-thumb.jpg"),
    scheduledDate: new Date(Date.now() + (index + 1) * 86400000)
      .toISOString()
      .slice(0, 10),
    scheduledTime: ["10:00", "14:00", "16:30", "18:00"][index] || "10:00",
    duration: String(video.duration || "12:00"),
    platform: index === 0 ? ["YouTube", "LinkedIn"] : ["YouTube"],
    status: index === 3 ? "completed" : "scheduled",
    visibility: "public",
    expectedViews: Math.max(100, Number(video.views || 0)),
    actualViews: index === 3 ? Number(video.views || 0) : undefined,
    description: String(video.description || ""),
    tags: Array.isArray(video.tags) ? video.tags.map(String) : [],
    isRecurring: index === 1,
    recurrencePattern: index === 1 ? "Chaque semaine" : undefined,
    reminders: [
      { type: "email", time: "1h avant", enabled: true },
      { type: "push", time: "15min avant", enabled: true },
    ],
  }));
}

export function getCreatorComments(creatorId: string) {
  return readJsonStore<CreatorComment[]>(
    "creator-comments.json",
    seedComments(creatorId)
  );
}

export function saveCreatorComments(comments: CreatorComment[]) {
  return writeJsonStore("creator-comments.json", comments);
}

export function getCreatorMedia(creatorId: string) {
  return readJsonStore<CreatorMediaItem[]>(
    "creator-media.json",
    seedMedia(creatorId)
  );
}

export function saveCreatorMedia(items: CreatorMediaItem[]) {
  return writeJsonStore("creator-media.json", items);
}

export function getCreatorLibrary(creatorId: string) {
  return readJsonStore<CreatorLibraryItem[]>(
    "creator-library.json",
    seedLibrary(creatorId)
  );
}

export function saveCreatorLibrary(items: CreatorLibraryItem[]) {
  return writeJsonStore("creator-library.json", items);
}

export function getCreatorSchedule(creatorId: string) {
  return readJsonStore<CreatorScheduleItem[]>(
    "creator-schedule.json",
    seedSchedule(creatorId)
  );
}

export function saveCreatorSchedule(items: CreatorScheduleItem[]) {
  return writeJsonStore("creator-schedule.json", items);
}

export function getCreatorAudienceAnalytics(creatorId: string) {
  const videos = getCreatorVideos(creatorId);
  const totalViews = videos.reduce(
    (sum, video) => sum + Number(video.views || 0),
    0
  );
  const totalLearners = videos.reduce(
    (sum, video) => sum + Number(video.students || 0),
    0
  );
  const totalLikes = videos.reduce(
    (sum, video) => sum + Number(video.likes || 0),
    0
  );

  return {
    totalViewers: totalViews,
    engagementRate:
      totalViews > 0 ? Math.round((totalLikes / totalViews) * 1000) / 10 : 0,
    targetAudience: totalLearners,
    watchTimeHours: Math.max(1, Math.round(totalViews / 320)),
    demographics: [
      { label: "18-24 ans", value: 28 },
      { label: "25-34 ans", value: 44 },
      { label: "35-44 ans", value: 20 },
      { label: "45+ ans", value: 8 },
    ],
    locations: [
      { label: "Bénin", value: 48 },
      { label: "France", value: 26 },
      { label: "Côte d'Ivoire", value: 16 },
      { label: "Sénégal", value: 10 },
    ],
  };
}

export function getCreatorRevenueAnalytics(creatorId: string) {
  const videos = getCreatorVideos(creatorId);
  const totalRevenue = videos.reduce(
    (sum, video) => sum + Number(video.revenue || 0),
    0
  );
  const totalOrders = videos.reduce(
    (sum, video) => sum + Number(video.students || 0),
    0
  );

  return {
    totalRevenue,
    monthlyRevenue: Math.round(totalRevenue * 0.27),
    growth: 14.2,
    averageOrderValue:
      totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(1)) : 0,
    totalOrders,
    conversionRate: 3.8,
    topProducts: [...videos]
      .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
      .slice(0, 4)
      .map((video) => ({
        name: String(video.title),
        revenue: Number(video.revenue || 0),
        orders: Number(video.students || 0),
      })),
    monthlyData: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin"].map(
      (month, index) => ({
        month,
        revenue: Math.round(totalRevenue * (0.08 + index * 0.03)),
        orders: Math.max(1, Math.round(totalOrders * (0.09 + index * 0.02))),
      })
    ),
  };
}

export function getCreatorEngagementAnalytics(creatorId: string) {
  const videos = getCreatorVideos(creatorId);
  const comments = getCreatorComments(creatorId);
  const totalLikes = videos.reduce(
    (sum, video) => sum + Number(video.likes || 0),
    0
  );
  const totalViews = videos.reduce(
    (sum, video) => sum + Number(video.views || 0),
    0
  );

  return {
    metrics: [
      {
        metric: "Likes",
        value: totalLikes,
        change: 12.5,
        color: "from-red-500 to-red-600",
      },
      {
        metric: "Commentaires",
        value: comments.filter((comment) => comment.status === "published")
          .length,
        change: 8.3,
        color: "from-blue-500 to-blue-600",
      },
      {
        metric: "Partages",
        value: Math.max(10, Math.round(totalViews / 18)),
        change: 4.1,
        color: "from-green-500 to-green-600",
      },
      {
        metric: "Durée moyenne",
        value: "4:32",
        change: 6.7,
        color: "from-purple-500 to-purple-600",
      },
    ],
    topVideos: videos.slice(0, 4).map((video) => ({
      id: String(video.id),
      title: String(video.title),
      thumbnail: String(video.thumbnail || "/videos/video1-thumb.jpg"),
      views: Number(video.views || 0),
      likes: Number(video.likes || 0),
      comments: comments.filter(
        (comment) => comment.video.id === String(video.id)
      ).length,
      shares: Math.max(5, Math.round(Number(video.views || 0) / 40)),
      engagement:
        Number(video.views || 0) > 0
          ? Number(
              (
                ((Number(video.likes || 0) + 3) / Number(video.views || 1)) *
                100
              ).toFixed(1)
            )
          : 0,
      duration: String(video.duration || "12:00"),
    })),
    audienceSegments: [
      {
        segment: "18-24 ans",
        percentage: 30,
        engagement: 8.2,
        color: "from-purple-500 to-purple-600",
      },
      {
        segment: "25-34 ans",
        percentage: 41,
        engagement: 7.4,
        color: "from-blue-500 to-blue-600",
      },
      {
        segment: "35-44 ans",
        percentage: 21,
        engagement: 6.6,
        color: "from-green-500 to-green-600",
      },
      {
        segment: "45+ ans",
        percentage: 8,
        engagement: 5.8,
        color: "from-orange-500 to-orange-600",
      },
    ],
    timeline: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
      (date, index) => ({
        date,
        likes: Math.max(10, Math.round(totalLikes / 10) + index * 8),
        comments: Math.max(1, comments.length + index),
        shares: Math.max(1, Math.round(totalViews / 150) + index),
        engagement: Number((5.8 + index * 0.25).toFixed(1)),
      })
    ),
    recentComments: comments.slice(0, 3),
  };
}

export function getCreatorSharesAnalytics(creatorId: string) {
  const videos = getCreatorVideos(creatorId);
  const totalViews = videos.reduce(
    (sum, video) => sum + Number(video.views || 0),
    0
  );
  const totalShares = Math.max(12, Math.round(totalViews / 25));
  const sharedVideos = videos.slice(0, 4).map((video, index) => {
    const totalVideoShares = Math.max(
      8,
      Math.round(Number(video.views || 0) / 35)
    );
    return {
      id: String(video.id),
      title: String(video.title),
      thumbnail: String(video.thumbnail || "/videos/video1-thumb.jpg"),
      totalShares: totalVideoShares,
      platforms: {
        facebook: Math.round(totalVideoShares * 0.28),
        twitter: Math.round(totalVideoShares * 0.12),
        linkedin: Math.round(totalVideoShares * 0.18),
        whatsapp: Math.round(totalVideoShares * 0.16),
        email: Math.round(totalVideoShares * 0.08),
        direct: Math.round(totalVideoShares * 0.18),
      },
      publishedAt:
        index === 0
          ? "Il y a 2 jours"
          : index === 1
            ? "Il y a 5 jours"
            : "Il y a 1 semaine",
      views: Number(video.views || 0),
      engagement:
        Number(video.views || 0) > 0
          ? Number(
              (
                ((Number(video.likes || 0) + totalVideoShares) /
                  Number(video.views || 1)) *
                100
              ).toFixed(1)
            )
          : 0,
    };
  });

  return {
    shareData: [
      {
        platform: "Facebook",
        shares: Math.round(totalShares * 0.24),
        clicks: Math.round(totalShares * 2.7),
        engagement: 278,
        change: 12.5,
        color: "from-blue-500 to-blue-600",
      },
      {
        platform: "Twitter",
        shares: Math.round(totalShares * 0.16),
        clicks: Math.round(totalShares * 2.2),
        engagement: 263,
        change: -2.1,
        color: "from-sky-500 to-sky-600",
      },
      {
        platform: "LinkedIn",
        shares: Math.round(totalShares * 0.14),
        clicks: Math.round(totalShares * 3.1),
        engagement: 414,
        change: 8.4,
        color: "from-blue-600 to-blue-700",
      },
      {
        platform: "WhatsApp",
        shares: Math.round(totalShares * 0.18),
        clicks: Math.round(totalShares * 2.4),
        engagement: 230,
        change: 15.7,
        color: "from-green-500 to-green-600",
      },
      {
        platform: "Email",
        shares: Math.round(totalShares * 0.08),
        clicks: Math.round(totalShares * 2.9),
        engagement: 380,
        change: 5.2,
        color: "from-purple-500 to-purple-600",
      },
      {
        platform: "Direct",
        shares: Math.round(totalShares * 0.2),
        clicks: Math.round(totalShares * 3),
        engagement: 300,
        change: 22.4,
        color: "from-gray-500 to-gray-600",
      },
    ],
    deviceStats: [
      { device: "Mobile", percentage: 66, color: "from-blue-500 to-blue-600" },
      {
        device: "Desktop",
        percentage: 26,
        color: "from-purple-500 to-purple-600",
      },
      { device: "Tablet", percentage: 8, color: "from-green-500 to-green-600" },
    ],
    timelineData: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
      (date, index) => ({
        date,
        shares: Math.round(totalShares / 7) + index * 6,
        clicks: Math.round(totalShares / 7) * 3 + index * 18,
      })
    ),
    sharedVideos,
  };
}
