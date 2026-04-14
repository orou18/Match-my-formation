import { getAuthToken } from "./auth-service";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "creator" | "admin";
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  subscription: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  subscription: string;
  level: number;
  notifications: number;
  created_at: string;
  updated_at: string;
}

class UserService {
  private async getHeaders() {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getCurrentUser(): Promise<User> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiBase}/api/user/profile`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiBase}/api/user/profile`, {
        method: "PUT",
        headers: await this.getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${apiBase}/api/user/upload-avatar`, {
        method: "POST",
        headers: {
          ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  }

  async getNotifications(): Promise<any[]> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiBase}/api/user/notifications`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async getUnreadNotificationsCount(): Promise<number> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(
        `${apiBase}/api/user/notifications/unread-count`,
        {
          method: "GET",
          headers: await this.getHeaders(),
        }
      );

      if (!response.ok) {
        return 0; // Return 0 if API fails
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      return 0; // Return 0 if API fails
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      await fetch(`${apiBase}/api/user/notifications/${notificationId}/read`, {
        method: "POST",
        headers: await this.getHeaders(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      await fetch(`${apiBase}/api/user/notifications/${notificationId}`, {
        method: "DELETE",
        headers: await this.getHeaders(),
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  async getStudentStats(): Promise<{
    courses_enrolled: number;
    courses_completed: number;
    total_watch_time: number;
    certificates_earned: number;
    average_progress: number;
  }> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiBase}/api/student/stats`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching student stats:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
