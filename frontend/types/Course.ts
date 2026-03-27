// frontend/types/Course.ts
export interface Course {
  id: string | number;
  title: string;
  image: string;
  duration: string;
  rating: number;
  views?: string;
  level?: string;
  instructor?: string;
  description?: string;
}
