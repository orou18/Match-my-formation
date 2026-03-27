import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  subscription: string;
  coursesCompleted: number;
  avatar: string;
  bio: string;
  expertise: string;
  rating: number;
};

export type AdminCreator = {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  courses: number;
  students: number;
  revenue: number;
  rating: number;
  totalViews: number;
  category: string;
  avatar: string;
  bio: string;
  expertise: string;
  verified: boolean;
  featured: boolean;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
  lastLogin: string;
  avatar: string;
  createdAt: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  target: string;
  status: string;
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openedCount: number;
  clickedCount: number;
  createdBy: string;
  createdAt: string;
};

export const allPermissions = [
  {
    id: "users_view",
    name: "Voir utilisateurs",
    description: "Accéder à la liste des utilisateurs",
    category: "Utilisateurs",
  },
  {
    id: "users_create",
    name: "Créer utilisateurs",
    description: "Créer de nouveaux comptes",
    category: "Utilisateurs",
  },
  {
    id: "users_edit",
    name: "Modifier utilisateurs",
    description: "Modifier les comptes existants",
    category: "Utilisateurs",
  },
  {
    id: "users_delete",
    name: "Supprimer utilisateurs",
    description: "Supprimer des comptes",
    category: "Utilisateurs",
  },
  {
    id: "creators_view",
    name: "Voir créateurs",
    description: "Accéder à la liste des créateurs",
    category: "Créateurs",
  },
  {
    id: "creators_manage",
    name: "Gérer créateurs",
    description: "Approuver/suspendre les créateurs",
    category: "Créateurs",
  },
  {
    id: "content_view",
    name: "Voir contenus",
    description: "Accéder à tous les contenus",
    category: "Contenus",
  },
  {
    id: "content_manage",
    name: "Gérer contenus",
    description: "Modérer et gérer les contenus",
    category: "Contenus",
  },
  {
    id: "ads_manage",
    name: "Gérer publicités",
    description: "Créer et gérer les campagnes",
    category: "Publicités",
  },
  {
    id: "webinars_manage",
    name: "Gérer webinaires",
    description: "Organiser et modérer les webinaires",
    category: "Webinaires",
  },
  {
    id: "analytics_view",
    name: "Voir analytics",
    description: "Accéder aux statistiques",
    category: "Analytics",
  },
  {
    id: "settings_system",
    name: "Paramètres système",
    description: "Configurer la plateforme",
    category: "Système",
  },
] as const;

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "chef@matchmyformation.com",
    role: "creator",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-03-18",
    subscription: "Premium",
    coursesCompleted: 12,
    avatar: "/temoignage.png",
    bio: "Chef etoile avec 15 ans d'experience",
    expertise: "Cuisine francaise",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Sophie Martin",
    email: "sommelier@matchmyformation.com",
    role: "creator",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "2024-03-17",
    subscription: "Pro",
    coursesCompleted: 8,
    avatar: "/temoignage.png",
    bio: "MS en sommellerie",
    expertise: "Vins et degustation",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Pierre Bernard",
    email: "restaurant@matchmyformation.com",
    role: "creator",
    status: "active",
    joinDate: "2024-03-10",
    lastActive: "2024-03-18",
    subscription: "Premium",
    coursesCompleted: 15,
    avatar: "/temoignage.png",
    bio: "Proprietaire de 3 restaurants",
    expertise: "Gestion restaurant",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Marie Dubois",
    email: "hotel@matchmyformation.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-20",
    lastActive: "2024-03-18",
    subscription: "Free",
    coursesCompleted: 3,
    avatar: "/temoignage.png",
    bio: "Directrice d'hotel 5 etoiles",
    expertise: "Hotellerie luxe",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Thomas Petit",
    email: "barman@matchmyformation.com",
    role: "student",
    status: "active",
    joinDate: "2024-02-15",
    lastActive: "2024-03-17",
    subscription: "Premium",
    coursesCompleted: 7,
    avatar: "/temoignage.png",
    bio: "Champion de France de mixologie",
    expertise: "Bar et cocktails",
    rating: 4.8,
  },
];

const DEFAULT_CREATORS: AdminCreator[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "chef@matchmyformation.com",
    status: "active",
    joinDate: "2024-01-15",
    courses: 12,
    students: 2847,
    revenue: 45678,
    rating: 4.8,
    totalViews: 125000,
    category: "Cuisine",
    avatar: "/temoignage.png",
    bio: "Chef etoile avec 15 ans d'experience",
    expertise: "Cuisine francaise",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    name: "Sophie Martin",
    email: "sommelier@matchmyformation.com",
    status: "active",
    joinDate: "2024-02-20",
    courses: 8,
    students: 1523,
    revenue: 28900,
    rating: 4.9,
    totalViews: 89000,
    category: "Vins",
    avatar: "/temoignage.png",
    bio: "MS en sommellerie",
    expertise: "Vins et degustation",
    verified: true,
    featured: false,
  },
  {
    id: "3",
    name: "Pierre Bernard",
    email: "restaurant@matchmyformation.com",
    status: "pending",
    joinDate: "2024-03-10",
    courses: 3,
    students: 456,
    revenue: 5400,
    rating: 4.7,
    totalViews: 23000,
    category: "Gestion",
    avatar: "/temoignage.png",
    bio: "Proprietaire de 3 restaurants",
    expertise: "Gestion restaurant",
    verified: false,
    featured: false,
  },
  {
    id: "4",
    name: "Marie Dubois",
    email: "hotel@matchmyformation.com",
    status: "active",
    joinDate: "2024-01-20",
    courses: 15,
    students: 3421,
    revenue: 67800,
    rating: 4.6,
    totalViews: 198000,
    category: "Hotellerie",
    avatar: "/temoignage.png",
    bio: "Directrice d'hotel 5 etoiles",
    expertise: "Hotellerie luxe",
    verified: true,
    featured: true,
  },
  {
    id: "5",
    name: "Thomas Petit",
    email: "barman@matchmyformation.com",
    status: "suspended",
    joinDate: "2024-02-15",
    courses: 5,
    students: 892,
    revenue: 12300,
    rating: 4.8,
    totalViews: 45000,
    category: "Bar",
    avatar: "/temoignage.png",
    bio: "Champion de France de mixologie",
    expertise: "Bar et cocktails",
    verified: true,
    featured: false,
  },
];

const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@platform.com",
    role: "super_admin",
    permissions: allPermissions.map((permission) => permission.id),
    status: "active",
    lastLogin: "2024-03-18T14:30:00Z",
    avatar: "/temoignage.png",
    createdAt: "2023-06-01",
  },
  {
    id: "2",
    name: "Marie Laurent",
    email: "marie.laurent@platform.com",
    role: "admin",
    permissions: [
      "users_view",
      "users_edit",
      "creators_view",
      "content_view",
      "analytics_view",
    ],
    status: "active",
    lastLogin: "2024-03-18T10:15:00Z",
    avatar: "/temoignage.png",
    createdAt: "2023-08-15",
  },
  {
    id: "3",
    name: "Pierre Martin",
    email: "pierre.martin@platform.com",
    role: "admin",
    permissions: [
      "users_view",
      "creators_view",
      "creators_manage",
      "content_manage",
    ],
    status: "active",
    lastLogin: "2024-03-17T16:45:00Z",
    avatar: "/temoignage.png",
    createdAt: "2023-10-20",
  },
  {
    id: "4",
    name: "Sophie Bernard",
    email: "sophie.bernard@platform.com",
    role: "admin",
    permissions: [
      "content_view",
      "content_manage",
      "ads_manage",
      "webinars_manage",
    ],
    status: "inactive",
    lastLogin: "2024-03-15T09:20:00Z",
    avatar: "/temoignage.png",
    createdAt: "2023-12-10",
  },
];

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    title: "Nouveau cours disponible",
    message:
      "Decouvrez notre nouveau cours sur le marketing digital pour les createurs",
    type: "info",
    target: "all",
    status: "sent",
    sentAt: "2024-03-15T10:00:00Z",
    recipients: 2847,
    openedCount: 1256,
    clickedCount: 423,
    createdBy: "Jean Dupont",
    createdAt: "2024-03-15T09:30:00Z",
  },
  {
    id: "2",
    title: "Maintenance systeme",
    message: "Une maintenance est prevue ce soir de 22h a 23h",
    type: "warning",
    target: "all",
    status: "scheduled",
    scheduledAt: "2024-03-20T22:00:00Z",
    recipients: 2847,
    openedCount: 0,
    clickedCount: 0,
    createdBy: "Marie Dubois",
    createdAt: "2024-03-18T14:00:00Z",
  },
  {
    id: "3",
    title: "Felicitations createurs",
    message: "Les createurs ont genere 23% de revenus supplementaires ce mois",
    type: "success",
    target: "creators",
    status: "sent",
    sentAt: "2024-03-10T16:00:00Z",
    recipients: 156,
    openedCount: 89,
    clickedCount: 34,
    createdBy: "Sophie Martin",
    createdAt: "2024-03-10T15:45:00Z",
  },
];

function nextId(items: Array<{ id: string }>) {
  return String(Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1);
}

export function getAdminUsers() {
  return readJsonStore("admin-users.json", DEFAULT_USERS);
}

export function saveAdminUsers(users: AdminUser[]) {
  return writeJsonStore("admin-users.json", users);
}

export function getAdminCreators() {
  return readJsonStore("admin-creators.json", DEFAULT_CREATORS);
}

export function saveAdminCreators(creators: AdminCreator[]) {
  return writeJsonStore("admin-creators.json", creators);
}

export function getAdminAdmins() {
  return readJsonStore("admin-admins.json", DEFAULT_ADMINS);
}

export function saveAdminAdmins(admins: AdminAccount[]) {
  return writeJsonStore("admin-admins.json", admins);
}

export function getAdminNotifications() {
  return readJsonStore("admin-notifications.json", DEFAULT_NOTIFICATIONS);
}

export function saveAdminNotifications(notifications: AdminNotification[]) {
  return writeJsonStore("admin-notifications.json", notifications);
}

export function getUsersStats(users = getAdminUsers()) {
  return {
    total: users.length,
    creators: users.filter((user) => user.role === "creator").length,
    students: users.filter((user) => user.role === "student").length,
    admins: users.filter((user) => user.role === "admin").length,
    active: users.filter((user) => user.status === "active").length,
  };
}

export function getCreatorsStats(creators = getAdminCreators()) {
  return {
    total: creators.length,
    active: creators.filter((creator) => creator.status === "active").length,
    pending: creators.filter((creator) => creator.status === "pending").length,
    suspended: creators.filter((creator) => creator.status === "suspended")
      .length,
    verified: creators.filter((creator) => creator.verified).length,
    totalRevenue: creators.reduce((sum, creator) => sum + creator.revenue, 0),
    totalStudents: creators.reduce((sum, creator) => sum + creator.students, 0),
    totalViews: creators.reduce((sum, creator) => sum + creator.totalViews, 0),
  };
}

export function getAdminsStats(admins = getAdminAdmins()) {
  return {
    total: admins.length,
    active: admins.filter((admin) => admin.status === "active").length,
    inactive: admins.filter((admin) => admin.status === "inactive").length,
    superAdmins: admins.filter((admin) => admin.role === "super_admin").length,
    admins: admins.filter((admin) => admin.role === "admin").length,
  };
}

export function getNotificationStats(notifications = getAdminNotifications()) {
  const openedNotifications = notifications.filter(
    (notification) => notification.openedCount > 0
  );
  return {
    total: notifications.length,
    sent: notifications.filter((notification) => notification.status === "sent")
      .length,
    scheduled: notifications.filter(
      (notification) => notification.status === "scheduled"
    ).length,
    draft: notifications.filter(
      (notification) => notification.status === "draft"
    ).length,
    totalOpened: notifications.reduce(
      (sum, notification) => sum + notification.openedCount,
      0
    ),
    totalClicked: notifications.reduce(
      (sum, notification) => sum + notification.clickedCount,
      0
    ),
    avgOpenRate:
      notifications.length > 0
        ? Math.round(
            notifications.reduce(
              (sum, notification) =>
                sum +
                (notification.recipients
                  ? (notification.openedCount / notification.recipients) * 100
                  : 0),
              0
            ) / notifications.length
          )
        : 0,
    avgClickRate:
      openedNotifications.length > 0
        ? Math.round(
            openedNotifications.reduce(
              (sum, notification) =>
                sum +
                (notification.openedCount
                  ? (notification.clickedCount / notification.openedCount) * 100
                  : 0),
              0
            ) / openedNotifications.length
          )
        : 0,
  };
}

export function buildAdminUser(
  input: Record<string, unknown>,
  users = getAdminUsers()
) {
  return {
    id: nextId(users),
    name: String(input.name || ""),
    email: String(input.email || ""),
    role: String(input.role || "student"),
    status: "active",
    joinDate: new Date().toISOString().split("T")[0],
    lastActive: new Date().toISOString().split("T")[0],
    subscription:
      input.role === "creator"
        ? "Pro"
        : input.role === "admin"
          ? "Admin"
          : "Free",
    coursesCompleted: 0,
    avatar: "/temoignage.png",
    bio: String(input.bio || ""),
    expertise: String(input.expertise || ""),
    rating: 0,
  };
}

export function buildAdminCreator(
  input: Record<string, unknown>,
  creators = getAdminCreators()
) {
  return {
    id: nextId(creators),
    name: String(input.name || ""),
    email: String(input.email || ""),
    status: "pending",
    joinDate: new Date().toISOString().split("T")[0],
    courses: 0,
    students: 0,
    revenue: 0,
    rating: 0,
    totalViews: 0,
    category: String(input.category || "General"),
    avatar: "/temoignage.png",
    bio: String(input.bio || ""),
    expertise: String(input.expertise || ""),
    verified: false,
    featured: false,
  };
}

export function buildAdminAdmin(
  input: Record<string, unknown>,
  admins = getAdminAdmins()
) {
  const role = String(input.role || "admin");
  return {
    id: nextId(admins),
    name: String(input.name || ""),
    email: String(input.email || ""),
    role,
    permissions:
      role === "super_admin"
        ? allPermissions.map((permission) => permission.id)
        : Array.isArray(input.permissions)
          ? input.permissions
          : [],
    status: "active",
    lastLogin: "",
    avatar: "/temoignage.png",
    createdAt: new Date().toISOString().split("T")[0],
  };
}

export function getRecipientsCount(target: string) {
  const users = getAdminUsers();
  const admins = getAdminAdmins();
  switch (target) {
    case "users":
      return users.filter((user) => user.role !== "admin").length;
    case "creators":
      return (
        users.filter((user) => user.role === "creator").length ||
        getAdminCreators().length
      );
    case "admins":
      return admins.length;
    case "all":
    default:
      return users.length + admins.length;
  }
}

export function buildAdminNotification(
  input: Record<string, unknown>,
  notifications = getAdminNotifications(),
  createdBy = "Admin"
) {
  const status = String(input.status || "draft");
  return {
    id: nextId(notifications),
    title: String(input.title || ""),
    message: String(input.message || ""),
    type: String(input.type || "info"),
    target: String(input.target || "all"),
    status,
    scheduledAt: input.scheduledAt ? String(input.scheduledAt) : undefined,
    sentAt: status === "sent" ? new Date().toISOString() : undefined,
    recipients: getRecipientsCount(String(input.target || "all")),
    openedCount: 0,
    clickedCount: 0,
    createdBy,
    createdAt: new Date().toISOString(),
  };
}
