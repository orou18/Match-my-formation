export interface FontSettings {
  title_font: string;
  subtitle_font: string;
  body_font: string;
  title_font_size: string;
  subtitle_font_size: string;
  body_font_size: string;
  title_font_weight: string;
  subtitle_font_weight: string;
  body_font_weight: string;
  title_color: string;
  subtitle_color: string;
  body_color: string;
  title_letter_spacing: string;
  subtitle_letter_spacing: string;
  body_letter_spacing: string;
  title_line_height: string;
  subtitle_line_height: string;
  body_line_height: string;
}

export interface BrandingSettings {
  id: string;
  company_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  text_secondary: string;
  border_color: string;
  font_settings: FontSettings;
  custom_css?: string;
  favicon_url?: string;
  custom_footer_text?: string;
  show_branding: boolean;
  created_at: string;
  updated_at: string;
}

export interface FontOption {
  family: string;
  category: "serif" | "sans-serif" | "monospace" | "display" | "handwriting";
  variants: string[];
  subsets: string[];
  popular?: boolean;
}

export interface BrandingFormData {
  company_name: string;
  logo_file?: File;
  favicon_file?: File;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  text_secondary: string;
  border_color: string;
  title_font: string;
  subtitle_font: string;
  body_font: string;
  title_font_size: string;
  subtitle_font_size: string;
  body_font_size: string;
  title_font_weight: string;
  subtitle_font_weight: string;
  body_font_weight: string;
  title_color: string;
  subtitle_color: string;
  body_color: string;
  title_letter_spacing: string;
  subtitle_letter_spacing: string;
  body_letter_spacing: string;
  title_line_height: string;
  subtitle_line_height: string;
  body_line_height: string;
  custom_css?: string;
  custom_footer_text?: string;
  show_branding: boolean;
}
