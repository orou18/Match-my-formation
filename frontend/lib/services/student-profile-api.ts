"use client";

type StudentRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function getStudentAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("nextauth.session-token") ||
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("employee_token")
  );
}

function buildHeaders(headers?: HeadersInit, body?: BodyInit | null) {
  const finalHeaders = new Headers(headers || {});

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  const token = getStudentAccessToken();
  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (
    body &&
    !(body instanceof FormData) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return finalHeaders;
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { error?: string; message?: string })?.message ||
      (payload as { error?: string; message?: string })?.error ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

async function studentRequest<T>(
  path: string,
  { query, headers, body, ...init }: StudentRequestOptions = {}
) {
  const url = new URL(
    path,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.pathname + url.search, {
    ...init,
    body,
    headers: buildHeaders(headers, body),
    cache: "no-store",
  });

  return readJson<T>(response);
}

export type StudentProfile = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  role?: string;
  subscription?: string;
  level?: number;
  joinDate?: string;
  coursesCompleted?: number;
  certificates?: number;
  averageRating?: number;
  completionRate?: number;
  learningTime?: number;
};

export type StudentSecuritySettings = {
  twoFactorEnabled: boolean;
  twoFactorMethod: "email" | "sms" | "app";
  email: string;
  phone?: string;
  lastPasswordChange: string;
  activeSessions: number;
};

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "course" | "system" | "message" | "achievement" | "marketing";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    courseName?: string;
    instructor?: string;
    amount?: string;
  };
};

export type StudentNotificationSettings = {
  courseAlerts: boolean;
  marketingEmails: boolean;
  directMessages: boolean;
  systemAnnouncements: boolean;
  achievementAlerts: boolean;
  weeklyDigest: boolean;
};

export type StudentPreferences = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
  timezone: string;
  language?: "fr" | "en" | "es";
  theme?: "light" | "dark";
};

export type StudentBillingPayload = {
  subscription: string;
  paymentMethod: {
    brand: string;
    maskedNumber: string;
    expiresAt: string;
  };
  transactions: Array<{
    id: string;
    label: string;
    amount: number;
    currency: string;
    status: "paid" | "pending" | "failed";
    paidAt: string;
  }>;
};

export const studentProfileApi = {
  getProfile() {
    return studentRequest<StudentProfile>("/api/user/profile");
  },

  updateProfile(payload: Partial<StudentProfile>) {
    return studentRequest<StudentProfile>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  uploadAvatar(formData: FormData) {
    return studentRequest<{ avatarUrl: string; message?: string }>(
      "/api/user/upload-avatar",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  getSecurity() {
    return studentRequest<StudentSecuritySettings>("/api/user/security");
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return studentRequest<{ success: boolean; message: string }>(
      "/api/user/change-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  setupTwoFactor(payload: { method: "email" | "sms" | "app" }) {
    return studentRequest<{
      success: boolean;
      message: string;
      method: string;
    }>("/api/user/2fa/setup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  verifyTwoFactor(payload: { code: string; method: "email" | "sms" | "app" }) {
    return studentRequest<{ message: string; twoFactorEnabled: boolean }>(
      "/api/user/2fa/verify",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  disableTwoFactor() {
    return studentRequest<{ message: string; twoFactorEnabled: boolean }>(
      "/api/user/2fa/disable",
      {
        method: "POST",
      }
    );
  },

  getNotifications() {
    return studentRequest<StudentNotification[]>("/api/user/notifications");
  },

  updateNotification(payload: {
    id?: string;
    isRead?: boolean;
    action?: "mark_all_read";
  }) {
    return studentRequest<StudentNotification[] | { error?: string }>(
      "/api/user/notifications",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  deleteNotification(id?: string) {
    return studentRequest<StudentNotification[]>("/api/user/notifications", {
      method: "DELETE",
      query: { id },
    });
  },

  getUnreadCount() {
    return studentRequest<{ count: number }>(
      "/api/user/notifications/unread-count"
    );
  },

  getNotificationSettings() {
    return studentRequest<StudentNotificationSettings>(
      "/api/user/notification-settings"
    );
  },

  updateNotificationSettings(payload: StudentNotificationSettings) {
    return studentRequest<StudentNotificationSettings & { message?: string }>(
      "/api/user/notification-settings",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  getPreferences() {
    return studentRequest<{
      success: boolean;
      preferences: StudentPreferences;
    }>("/api/user/preferences");
  },

  updatePreferences(payload: StudentPreferences) {
    return studentRequest<{
      success: boolean;
      preferences: StudentPreferences;
    }>("/api/user/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferences: payload }),
    });
  },

  getBilling() {
    return studentRequest<StudentBillingPayload>("/api/user/billing");
  },
};
