import { getAuthToken } from "./auth-service";

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  thumbnail?: string;
  video_url?: string;
  duration?: string;
  students_count: number;
  rating: number;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    specialty?: string;
  };
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseResponse {
  data: Course[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class CoursesService {
  private async getHeaders() {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    };
  }

  async getCourses(page = 1, perPage = 12): Promise<CourseResponse> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = new URL(`${apiBase}/api/courses`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());

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
      console.error("Error fetching courses:", error);
      throw error;
    }
  }

  async getCourse(id: number): Promise<Course> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/courses/${id}`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  }

  async getStudentCourses(): Promise<Course[]> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/student/courses`, {
        method: "GET",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching student courses:", error);
      throw error;
    }
  }

  async enrollInCourse(courseId: number): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiBase}/api/student/courses/${courseId}/enroll`, {
        method: "POST",
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  }

  async searchCourses(query: string, filters?: {
    category?: string;
    rating?: number;
    minStudents?: number;
  }): Promise<CourseResponse> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const url = new URL(`${apiBase}/api/courses/search`);
    url.searchParams.append('q', query);
    
    if (filters?.category) {
      url.searchParams.append('category', filters.category);
    }
    if (filters?.rating) {
      url.searchParams.append('rating', filters.rating.toString());
    }
    if (filters?.minStudents) {
      url.searchParams.append('min_students', filters.minStudents.toString());
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
      console.error("Error searching courses:", error);
      throw error;
    }
  }
}

export const coursesService = new CoursesService();
