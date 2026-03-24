import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { BrandingSettings } from '@/types/branding';

// Données persistantes pour les paramètres de marque blanche
let brandingSettings: BrandingSettings = {
  id: '1',
  company_name: 'Match My Formation',
  logo_url: '/logo.png',
  primary_color: '#667eea',
  secondary_color: '#764ba2',
  accent_color: '#f093fb',
  background_color: '#ffffff',
  surface_color: '#f8fafc',
  text_color: '#1a202c',
  text_secondary: '#4a5568',
  border_color: '#e2e8f0',
  font_settings: {
    title_font: 'Inter',
    subtitle_font: 'Inter',
    body_font: 'Inter',
    title_font_size: '2rem',
    subtitle_font_size: '1.5rem',
    body_font_size: '1rem',
    title_font_weight: '700',
    subtitle_font_weight: '600',
    body_font_weight: '400',
    title_color: '#1a202c',
    subtitle_color: '#2d3748',
    body_color: '#4a5568',
    title_letter_spacing: '-0.025em',
    subtitle_letter_spacing: '0em',
    body_letter_spacing: '0em',
    title_line_height: '1.2',
    subtitle_line_height: '1.4',
    body_line_height: '1.6'
  },
  custom_css: '',
  favicon_url: '/favicon.ico',
  custom_footer_text: '',
  show_branding: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export async function GET(request: NextRequest) {
  try {
    // Temporairement désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions);
    // 
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }

    console.log('BRANDING - Paramètres chargés');
    
    return NextResponse.json(brandingSettings);
  } catch (error) {
    console.error('BRANDING - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Temporairement désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions);
    // 
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    // }

    const formData = await request.formData();
    
    // Extraire les données du formulaire
    const companyName = formData.get('company_name') as string;
    const primaryColor = formData.get('primary_color') as string;
    const secondaryColor = formData.get('secondary_color') as string;
    const accentColor = formData.get('accent_color') as string;
    const backgroundColor = formData.get('background_color') as string;
    const surfaceColor = formData.get('surface_color') as string;
    const textColor = formData.get('text_color') as string;
    const textSecondary = formData.get('text_secondary') as string;
    const borderColor = formData.get('border_color') as string;
    
    // Paramètres de polices
    const titleFont = formData.get('title_font') as string;
    const subtitleFont = formData.get('subtitle_font') as string;
    const bodyFont = formData.get('body_font') as string;
    const titleFontSize = formData.get('title_font_size') as string;
    const subtitleFontSize = formData.get('subtitle_font_size') as string;
    const bodyFontSize = formData.get('body_font_size') as string;
    const titleFontWeight = formData.get('title_font_weight') as string;
    const subtitleFontWeight = formData.get('subtitle_font_weight') as string;
    const bodyFontWeight = formData.get('body_font_weight') as string;
    const titleColor = formData.get('title_color') as string;
    const subtitleColor = formData.get('subtitle_color') as string;
    const bodyColor = formData.get('body_color') as string;
    const titleLetterSpacing = formData.get('title_letter_spacing') as string;
    const subtitleLetterSpacing = formData.get('subtitle_letter_spacing') as string;
    const bodyLetterSpacing = formData.get('body_letter_spacing') as string;
    const titleLineHeight = formData.get('title_line_height') as string;
    const subtitleLineHeight = formData.get('subtitle_line_height') as string;
    const bodyLineHeight = formData.get('body_line_height') as string;
    
    const customCss = formData.get('custom_css') as string;
    const customFooterText = formData.get('custom_footer_text') as string;
    const showBranding = formData.get('show_branding') === 'true';
    
    const logoFile = formData.get('logo_file') as File;
    const faviconFile = formData.get('favicon_file') as File;

    // Validation
    if (!companyName || !primaryColor) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Traiter les fichiers uploadés
    let logoUrl = brandingSettings.logo_url;
    let faviconUrl = brandingSettings.favicon_url;

    if (logoFile) {
      logoUrl = `/uploads/branding/${Date.now()}-${logoFile.name}`;
      // En production, sauvegarder le fichier ici
    }

    if (faviconFile) {
      faviconUrl = `/uploads/branding/${Date.now()}-${faviconFile.name}`;
      // En production, sauvegarder le fichier ici
    }

    // Mettre à jour les paramètres
    brandingSettings = {
      ...brandingSettings,
      company_name: companyName,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      background_color: backgroundColor,
      surface_color: surfaceColor,
      text_color: textColor,
      text_secondary: textSecondary,
      border_color: borderColor,
      font_settings: {
        title_font: titleFont,
        subtitle_font: subtitleFont,
        body_font: bodyFont,
        title_font_size: titleFontSize,
        subtitle_font_size: subtitleFontSize,
        body_font_size: bodyFontSize,
        title_font_weight: titleFontWeight,
        subtitle_font_weight: subtitleFontWeight,
        body_font_weight: bodyFontWeight,
        title_color: titleColor,
        subtitle_color: subtitleColor,
        body_color: bodyColor,
        title_letter_spacing: titleLetterSpacing,
        subtitle_letter_spacing: subtitleLetterSpacing,
        body_letter_spacing: bodyLetterSpacing,
        title_line_height: titleLineHeight,
        subtitle_line_height: subtitleLineHeight,
        body_line_height: bodyLineHeight
      },
      custom_css: customCss || '',
      custom_footer_text: customFooterText || '',
      show_branding: showBranding,
      updated_at: new Date().toISOString()
    };

    console.log('BRANDING - Paramètres mis à jour:', companyName);
    
    return NextResponse.json({
      message: 'Paramètres de marque blanche mis à jour avec succès',
      settings: brandingSettings
    });
  } catch (error) {
    console.error('BRANDING - Erreur mise à jour:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
