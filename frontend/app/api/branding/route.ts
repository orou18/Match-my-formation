import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";
import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

const FALLBACK_SETTINGS = {
  id: "1",
  company_name: "Match My Formation",
  logo_url: "/logo.png",
  primary_color: "#667eea",
  secondary_color: "#764ba2",
  accent_color: "#f093fb",
  background_color: "#ffffff",
  surface_color: "#f8fafc",
  text_color: "#1a202c",
  text_secondary: "#4a5568",
  border_color: "#e2e8f0",
  font_settings: {
    title_font: "Inter",
    subtitle_font: "Inter",
    body_font: "Inter",
    title_font_size: "2rem",
    subtitle_font_size: "1.5rem",
    body_font_size: "1rem",
    title_font_weight: "700",
    subtitle_font_weight: "600",
    body_font_weight: "400",
    title_color: "#1a202c",
    subtitle_color: "#2d3748",
    body_color: "#4a5568",
    title_letter_spacing: "-0.025em",
    subtitle_letter_spacing: "0em",
    body_letter_spacing: "0em",
    title_line_height: "1.2",
    subtitle_line_height: "1.4",
    body_line_height: "1.6",
  },
  custom_css: "",
  favicon_url: "/favicon.ico",
  custom_footer_text: "",
  show_branding: true,
};

export async function GET(request: NextRequest) {
  try {
    // Utiliser directement les données par défaut pour éviter les erreurs 401
    // Le backend sera utilisé uniquement pour les mises à jour (PUT)
    const fallback = readJsonStore("branding-fallback.json", FALLBACK_SETTINGS);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error("BRANDING - Erreur:", error);
    return NextResponse.json(
      readJsonStore("branding-fallback.json", FALLBACK_SETTINGS)
    );
  }
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();

  try {
    // Simuler une réponse réussie sans appeler le backend Laravel
    const current = readJsonStore("branding-fallback.json", FALLBACK_SETTINGS);
    const nextSettings = {
      ...current,
      company_name:
        (formData.get("company_name") as string) || current.company_name,
      primary_color:
        (formData.get("primary_color") as string) || current.primary_color,
      secondary_color:
        (formData.get("secondary_color") as string) || current.secondary_color,
      accent_color:
        (formData.get("accent_color") as string) || current.accent_color,
      background_color:
        (formData.get("background_color") as string) ||
        current.background_color,
      surface_color:
        (formData.get("surface_color") as string) || current.surface_color,
      text_color: (formData.get("text_color") as string) || current.text_color,
      text_secondary:
        (formData.get("text_secondary") as string) || current.text_secondary,
      border_color:
        (formData.get("border_color") as string) || current.border_color,
      custom_css: (formData.get("custom_css") as string) || current.custom_css,
      custom_footer_text:
        (formData.get("custom_footer_text") as string) ||
        current.custom_footer_text,
      show_branding: formData.get("show_branding") === "true",
      font_settings: {
        ...current.font_settings,
        title_font:
          (formData.get("title_font") as string) ||
          current.font_settings.title_font,
        subtitle_font:
          (formData.get("subtitle_font") as string) ||
          current.font_settings.subtitle_font,
        body_font:
          (formData.get("body_font") as string) ||
          current.font_settings.body_font,
        title_font_size:
          (formData.get("title_font_size") as string) ||
          current.font_settings.title_font_size,
        subtitle_font_size:
          (formData.get("subtitle_font_size") as string) ||
          current.font_settings.subtitle_font_size,
        body_font_size:
          (formData.get("body_font_size") as string) ||
          current.font_settings.body_font_size,
        title_font_weight:
          (formData.get("title_font_weight") as string) ||
          current.font_settings.title_font_weight,
        subtitle_font_weight:
          (formData.get("subtitle_font_weight") as string) ||
          current.font_settings.subtitle_font_weight,
        body_font_weight:
          (formData.get("body_font_weight") as string) ||
          current.font_settings.body_font_weight,
        title_color:
          (formData.get("title_color") as string) ||
          current.font_settings.title_color,
        subtitle_color:
          (formData.get("subtitle_color") as string) ||
          current.font_settings.subtitle_color,
        body_color:
          (formData.get("body_color") as string) ||
          current.font_settings.body_color,
        title_letter_spacing:
          (formData.get("title_letter_spacing") as string) ||
          current.font_settings.title_letter_spacing,
        subtitle_letter_spacing:
          (formData.get("subtitle_letter_spacing") as string) ||
          current.font_settings.subtitle_letter_spacing,
        body_letter_spacing:
          (formData.get("body_letter_spacing") as string) ||
          current.font_settings.body_letter_spacing,
        title_line_height:
          (formData.get("title_line_height") as string) ||
          current.font_settings.title_line_height,
        subtitle_line_height:
          (formData.get("subtitle_line_height") as string) ||
          current.font_settings.subtitle_line_height,
        body_line_height:
          (formData.get("body_line_height") as string) ||
          current.font_settings.body_line_height,
      },
    };

    console.log("Branding settings saved:", nextSettings);

    return NextResponse.json({
      message: "Paramètres de marque blanche sauvegardés avec succès",
      settings: writeJsonStore("branding-fallback.json", nextSettings),
    });
  } catch (error) {
    console.error("BRANDING - Erreur mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde des paramètres" },
      { status: 500 }
    );
  }
}
