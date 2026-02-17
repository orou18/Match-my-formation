export interface Video {
  id: number;
  title: string;
  slug: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category: string;
  visibility: 'public' | 'private';
  views: number;
  uploader_id: number;
  company_id?: number;
  module_id?: number;
  created_at: string;
  // Relations optionnelles (chargées avec .with() en PHP)
  company?: any; 
  uploader?: any;
}