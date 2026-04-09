import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

export type PlatformRole =
  | "student"
  | "creator"
  | "admin"
  | "super_admin"
  | "employee";

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: PlatformRole;
  status: "active" | "pending" | "inactive" | "suspended";
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  subscription?: string;
  joinDate: string;
  created_at: string;
  updated_at: string;
  lastLogin?: string | null;
  permissions?: string[];
  creatorAccess?: {
    temporary_login: string;
    temporary_password: string;
    granted_at: string;
    granted_by: string;
  } | null;
};

export type UserPreferences = {
  userId: string;
  language: string;
  theme: "light" | "dark" | "system";
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
};

export type UserSecurity = {
  userId: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: "email" | "sms";
  phone: string;
  lastPasswordChange: string;
  activeSessions: number;
};

export type UserNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "course" | "achievement" | "message" | "system" | "marketing";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type NotificationSettings = {
  userId: string;
  courseAlerts: boolean;
  marketingEmails: boolean;
  directMessages: boolean;
  systemAnnouncements: boolean;
  achievementAlerts: boolean;
  weeklyDigest: boolean;
};

export type CreatorApplication = {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  motivation: string;
  expertise: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewMessage?: string;
  temporary_login?: string;
  temporary_password?: string;
};

export type BillingRecord = {
  id: string;
  userId: string;
  label: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  paidAt: string;
};

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: "1",
    name: "Direction Match Admin",
    email: "admin@match.com",
    password: "Azerty123!",
    role: "admin",
    status: "active",
    avatar: "/temoignage.png",
    phone: "+229 00 00 00 01",
    bio: "Administrateur principal de la plateforme",
    location: "Cotonou, Bénin",
    subscription: "ADMIN",
    joinDate: "2024-01-15",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z",
    lastLogin: null,
    permissions: ["analytics_view", "users_view", "creators_manage"],
  },
  {
    id: "2",
    name: "Jean Formateur",
    email: "creator@match.com",
    password: "Azerty123!",
    role: "creator",
    status: "active",
    avatar: "/temoignage.png",
    phone: "+229 00 00 00 02",
    bio: "Formateur expert en tourisme et hôtellerie",
    location: "Cotonou, Bénin",
    website: "https://creator.match.com",
    subscription: "PRO",
    joinDate: "2024-01-20",
    created_at: "2024-01-20T00:00:00.000Z",
    updated_at: "2024-01-20T00:00:00.000Z",
    lastLogin: null,
    creatorAccess: {
      temporary_login: "creator@match.com",
      temporary_password: "Azerty123!",
      granted_at: "2024-01-20T00:00:00.000Z",
      granted_by: "system",
    },
  },
  {
    id: "3",
    name: "Alice Élève",
    email: "student@match.com",
    password: "Azerty123!",
    role: "student",
    status: "active",
    avatar: "/temoignage.png",
    phone: "+229 00 00 00 03",
    bio: "Passionnée par l'apprentissage et le développement personnel",
    location: "Cotonou, Bénin",
    subscription: "FREE",
    joinDate: "2024-01-15",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z",
    lastLogin: null,
  },
  {
    id: "4",
    name: "Super Admin Match",
    email: "superadmin@match.com",
    password: "Azerty123!",
    role: "super_admin",
    status: "active",
    avatar: "/temoignage.png",
    phone: "+229 00 00 00 04",
    bio: "Super administrateur de la plateforme",
    location: "Cotonou, Bénin",
    subscription: "ADMIN",
    joinDate: "2024-01-10",
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-10T00:00:00.000Z",
    lastLogin: null,
    permissions: [
      "users_view",
      "users_create",
      "users_edit",
      "users_delete",
      "creators_view",
      "creators_manage",
      "content_view",
      "content_manage",
      "ads_manage",
      "webinars_manage",
      "analytics_view",
      "settings_system",
    ],
  },
];

function nowIso() {
  return new Date().toISOString();
}

function nextId(items: Array<{ id: string }>) {
  return String(Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1);
}

export function getAccounts() {
  return readJsonStore<UserAccount[]>("accounts.json", DEFAULT_ACCOUNTS);
}

export function saveAccounts(accounts: UserAccount[]) {
  return writeJsonStore("accounts.json", accounts);
}

export function findAccountByEmail(email: string) {
  return getAccounts().find(
    (account) => account.email.toLowerCase() === email.toLowerCase()
  );
}

export function findAccountById(id: string) {
  return getAccounts().find((account) => account.id === id);
}

export function createStudentAccount(input: {
  name: string;
  email: string;
  password: string;
}) {
  const accounts = getAccounts();
  const account: UserAccount = {
    id: nextId(accounts),
    name: input.name,
    email: input.email,
    password: input.password,
    role: "student",
    status: "active",
    avatar: "/temoignage.png",
    phone: "",
    bio: "",
    location: "",
    website: "",
    subscription: "FREE",
    joinDate: new Date().toLocaleDateString("fr-FR"),
    created_at: nowIso(),
    updated_at: nowIso(),
    lastLogin: null,
  };

  saveAccounts([...accounts, account]);
  ensureUserRecords(account.id, account.role);
  return account;
}

export function updateAccount(
  id: string,
  updates: Partial<Omit<UserAccount, "id" | "created_at">>
) {
  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.id === id);
  if (index === -1) {
    return null;
  }

  accounts[index] = {
    ...accounts[index],
    ...updates,
    updated_at: nowIso(),
  };

  saveAccounts(accounts);
  return accounts[index];
}

export function updateLastLogin(id: string) {
  return updateAccount(id, { lastLogin: nowIso() });
}

function defaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    language: "fr",
    theme: "light",
    timezone: "Africa/Porto-Novo",
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
  };
}

function defaultSecurity(userId: string): UserSecurity {
  return {
    userId,
    twoFactorEnabled: false,
    twoFactorMethod: "email",
    phone: "",
    lastPasswordChange: nowIso(),
    activeSessions: 1,
  };
}

function defaultNotificationSettings(userId: string): NotificationSettings {
  return {
    userId,
    courseAlerts: true,
    marketingEmails: false,
    directMessages: true,
    systemAnnouncements: true,
    achievementAlerts: true,
    weeklyDigest: true,
  };
}

function defaultNotifications(
  userId: string,
  role: PlatformRole
): UserNotification[] {
  return [
    {
      id: `${userId}-1`,
      userId,
      title: "Bienvenue sur Match My Formation",
      message: `Votre espace ${role} est prêt à être utilisé.`,
      type: "success",
      category: "system",
      isRead: false,
      createdAt: nowIso(),
    },
  ];
}

export function getProfiles() {
  return readJsonStore<Record<string, Partial<UserAccount>>>(
    "profiles.json",
    {}
  );
}

export function saveProfiles(profiles: Record<string, Partial<UserAccount>>) {
  return writeJsonStore("profiles.json", profiles);
}

export function getProfile(userId: string) {
  const account = findAccountById(userId);
  if (!account) return null;
  const profiles = getProfiles();
  return {
    ...account,
    ...(profiles[userId] || {}),
  };
}

export function updateProfile(
  userId: string,
  updates: Partial<UserAccount>
) {
  const profiles = getProfiles();
  profiles[userId] = {
    ...(profiles[userId] || {}),
    ...updates,
    updated_at: nowIso(),
  };
  saveProfiles(profiles);
  return getProfile(userId);
}

export function getPreferences() {
  return readJsonStore<Record<string, UserPreferences>>("preferences.json", {});
}

export function savePreferences(preferences: Record<string, UserPreferences>) {
  return writeJsonStore("preferences.json", preferences);
}

export function getUserPreferences(userId: string) {
  const preferences = getPreferences();
  if (!preferences[userId]) {
    preferences[userId] = defaultPreferences(userId);
    savePreferences(preferences);
  }
  return preferences[userId];
}

export function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
) {
  const preferences = getPreferences();
  preferences[userId] = {
    ...defaultPreferences(userId),
    ...(preferences[userId] || {}),
    ...updates,
    userId,
  };
  savePreferences(preferences);
  return preferences[userId];
}

export function getSecurityRecords() {
  return readJsonStore<Record<string, UserSecurity>>("security.json", {});
}

export function saveSecurityRecords(records: Record<string, UserSecurity>) {
  return writeJsonStore("security.json", records);
}

export function getUserSecurity(userId: string) {
  const records = getSecurityRecords();
  if (!records[userId]) {
    records[userId] = defaultSecurity(userId);
    saveSecurityRecords(records);
  }
  return records[userId];
}

export function updateUserSecurity(
  userId: string,
  updates: Partial<UserSecurity>
) {
  const records = getSecurityRecords();
  records[userId] = {
    ...defaultSecurity(userId),
    ...(records[userId] || {}),
    ...updates,
    userId,
  };
  saveSecurityRecords(records);
  return records[userId];
}

export function getNotificationsStore() {
  return readJsonStore<Record<string, UserNotification[]>>(
    "user-notifications.json",
    {}
  );
}

export function saveNotificationsStore(
  notifications: Record<string, UserNotification[]>
) {
  return writeJsonStore("user-notifications.json", notifications);
}

export function getUserNotifications(userId: string, role: PlatformRole) {
  const store = getNotificationsStore();
  if (!store[userId]) {
    store[userId] = defaultNotifications(userId, role);
    saveNotificationsStore(store);
  }
  return store[userId];
}

export function saveUserNotifications(
  userId: string,
  notifications: UserNotification[]
) {
  const store = getNotificationsStore();
  store[userId] = notifications;
  saveNotificationsStore(store);
  return notifications;
}

export function getNotificationSettingsStore() {
  return readJsonStore<Record<string, NotificationSettings>>(
    "notification-settings.json",
    {}
  );
}

export function saveNotificationSettingsStore(
  settings: Record<string, NotificationSettings>
) {
  return writeJsonStore("notification-settings.json", settings);
}

export function getUserNotificationSettings(userId: string) {
  const store = getNotificationSettingsStore();
  if (!store[userId]) {
    store[userId] = defaultNotificationSettings(userId);
    saveNotificationSettingsStore(store);
  }
  return store[userId];
}

export function updateUserNotificationSettings(
  userId: string,
  updates: Partial<NotificationSettings>
) {
  const store = getNotificationSettingsStore();
  store[userId] = {
    ...defaultNotificationSettings(userId),
    ...(store[userId] || {}),
    ...updates,
    userId,
  };
  saveNotificationSettingsStore(store);
  return store[userId];
}

export function getCreatorApplications() {
  return readJsonStore<CreatorApplication[]>("creator-applications.json", []);
}

export function saveCreatorApplications(applications: CreatorApplication[]) {
  return writeJsonStore("creator-applications.json", applications);
}

export function createCreatorApplication(input: {
  userId: string;
  studentName: string;
  studentEmail: string;
  motivation: string;
  expertise: string;
  category: string;
}) {
  const applications = getCreatorApplications();
  const existingPending = applications.find(
    (application) =>
      application.userId === input.userId && application.status === "pending"
  );

  if (existingPending) {
    return { error: "Une demande est déjà en attente pour cet utilisateur." };
  }

  const application: CreatorApplication = {
    id: nextId(applications),
    userId: input.userId,
    studentName: input.studentName,
    studentEmail: input.studentEmail,
    motivation: input.motivation,
    expertise: input.expertise,
    category: input.category,
    status: "pending",
    createdAt: nowIso(),
  };

  saveCreatorApplications([application, ...applications]);
  return { application };
}

export function reviewCreatorApplication(
  id: string,
  input: {
    status: "approved" | "rejected";
    reviewedBy: string;
    reviewMessage?: string;
  }
) {
  const applications = getCreatorApplications();
  const index = applications.findIndex((application) => application.id === id);
  if (index === -1) {
    return null;
  }

  const target = applications[index];
  const updated: CreatorApplication = {
    ...target,
    status: input.status,
    reviewedAt: nowIso(),
    reviewedBy: input.reviewedBy,
    reviewMessage: input.reviewMessage,
  };

  if (input.status === "approved") {
    const login = `creator-${target.userId}`;
    const temporaryPassword = `Creator${target.userId}!2026`;
    updated.temporary_login = login;
    updated.temporary_password = temporaryPassword;

    updateAccount(target.userId, {
      role: "creator",
      status: "active",
      subscription: "PRO",
      password: temporaryPassword,
      creatorAccess: {
        temporary_login: target.studentEmail,
        temporary_password: temporaryPassword,
        granted_at: nowIso(),
        granted_by: input.reviewedBy,
      },
    });

    const profile = getProfile(target.userId);
    if (profile) {
      updateProfile(target.userId, {
        role: "creator",
        bio: profile.bio || target.motivation,
      });
    }
  }

  applications[index] = updated;
  saveCreatorApplications(applications);
  return updated;
}

export function ensureUserRecords(userId: string, role: PlatformRole) {
  getUserPreferences(userId);
  getUserSecurity(userId);
  getUserNotificationSettings(userId);
  getUserNotifications(userId, role);
}

export function seedAccountDerivedData() {
  getAccounts().forEach((account) => {
    ensureUserRecords(account.id, account.role);
  });
}

export function getBillingStore() {
  return readJsonStore<Record<string, BillingRecord[]>>("billing.json", {});
}

export function saveBillingStore(store: Record<string, BillingRecord[]>) {
  return writeJsonStore("billing.json", store);
}

export function getUserBilling(userId: string) {
  const store = getBillingStore();
  if (!store[userId]) {
    store[userId] = [
      {
        id: `${userId}-billing-1`,
        userId,
        label: "Abonnement Premium - Février 2026",
        amount: 29,
        currency: "EUR",
        status: "paid",
        paidAt: "2026-02-12T10:00:00.000Z",
      },
      {
        id: `${userId}-billing-2`,
        userId,
        label: "Abonnement Premium - Janvier 2026",
        amount: 29,
        currency: "EUR",
        status: "paid",
        paidAt: "2026-01-12T10:00:00.000Z",
      },
    ];
    saveBillingStore(store);
  }
  return store[userId];
}
