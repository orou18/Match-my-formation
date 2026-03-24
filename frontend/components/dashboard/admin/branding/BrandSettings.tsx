"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Upload,
  X,
  Palette,
  Type,
  Eye,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { BrandingSettings, BrandingFormData, FontOption } from '@/types/branding';
import { useNotifications } from '@/components/ui/Notifications';

// Liste des polices Google Fonts disponibles
const FONT_OPTIONS: FontOption[] = [
  { family: 'Inter', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], popular: true },
  { family: 'Roboto', category: 'sans-serif', variants: ['300', '400', '500', '700'], subsets: ['latin'], popular: true },
  { family: 'Poppins', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], popular: true },
  { family: 'Montserrat', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], popular: true },
  { family: 'Playfair Display', category: 'serif', variants: ['400', '700'], subsets: ['latin'], popular: true },
  { family: 'Merriweather', category: 'serif', variants: ['300', '400', '700'], subsets: ['latin'], popular: true },
  { family: 'Lora', category: 'serif', variants: ['400', '500', '600', '700'], subsets: ['latin'] },
  { family: 'Space Mono', category: 'monospace', variants: ['400', '700'], subsets: ['latin'] },
  { family: 'Bebas Neue', category: 'display', variants: ['400'], subsets: ['latin'] },
  { family: 'Dancing Script', category: 'handwriting', variants: ['400', '700'], subsets: ['latin'] },
  { family: 'Oswald', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
  { family: 'Raleway', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'] },
  { family: 'Ubuntu', category: 'sans-serif', variants: ['300', '400', '500', '700'], subsets: ['latin'] },
  { family: 'Open Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], popular: true },
  { family: 'Lato', category: 'sans-serif', variants: ['300', '400', '700'], subsets: ['latin'], popular: true },
];

export default function BrandSettings() {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [formData, setFormData] = useState<BrandingFormData>({
    company_name: '',
    primary_color: '#667eea',
    secondary_color: '#764ba2',
    accent_color: '#f093fb',
    background_color: '#ffffff',
    surface_color: '#f8fafc',
    text_color: '#1a202c',
    text_secondary: '#4a5568',
    border_color: '#e2e8f0',
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
    body_line_height: '1.6',
    custom_css: '',
    custom_footer_text: '',
    show_branding: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const { addNotification } = useNotifications();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/branding');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setFormData({
          company_name: data.company_name,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          background_color: data.background_color,
          surface_color: data.surface_color,
          text_color: data.text_color,
          text_secondary: data.text_secondary,
          border_color: data.border_color,
          title_font: data.font_settings.title_font,
          subtitle_font: data.font_settings.subtitle_font,
          body_font: data.font_settings.body_font,
          title_font_size: data.font_settings.title_font_size,
          subtitle_font_size: data.font_settings.subtitle_font_size,
          body_font_size: data.font_settings.body_font_size,
          title_font_weight: data.font_settings.title_font_weight,
          subtitle_font_weight: data.font_settings.subtitle_font_weight,
          body_font_weight: data.font_settings.body_font_weight,
          title_color: data.font_settings.title_color,
          subtitle_color: data.font_settings.subtitle_color,
          body_color: data.font_settings.body_color,
          title_letter_spacing: data.font_settings.title_letter_spacing,
          subtitle_letter_spacing: data.font_settings.subtitle_letter_spacing,
          body_letter_spacing: data.font_settings.body_letter_spacing,
          title_line_height: data.font_settings.title_line_height,
          subtitle_line_height: data.font_settings.subtitle_line_height,
          body_line_height: data.font_settings.body_line_height,
          custom_css: data.custom_css || '',
          custom_footer_text: data.custom_footer_text || '',
          show_branding: data.show_branding
        });
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les paramètres de marque blanche',
        persistent: true
      });
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    addNotification({
      type: 'loading',
      title: 'Sauvegarde en cours',
      message: 'Vos paramètres sont en cours de sauvegarde...',
      persistent: true
    });

    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/branding', {
        method: 'PUT',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setSettings(result.settings);
        addNotification({
          type: 'success',
          title: 'Paramètres sauvegardés',
          message: 'Les modifications ont été appliquées avec succès'
        });
      } else {
        const error = await response.json();
        addNotification({
          type: 'error',
          title: 'Erreur de sauvegarde',
          message: error.error || 'Une erreur est survenue',
          persistent: true
        });
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      addNotification({
        type: 'error',
        title: 'Erreur technique',
        message: 'Une erreur technique est survenue lors de la sauvegarde',
        persistent: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = (file: File) => {
    setFormData({ ...formData, logo_file: file });
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFaviconUpload = (file: File) => {
    setFormData({ ...formData, favicon_file: file });
    setFaviconPreview(URL.createObjectURL(file));
  };

  const applyGoogleFont = (fontFamily: string) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const resetToDefaults = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setFormData({
        company_name: 'Match My Formation',
        primary_color: '#667eea',
        secondary_color: '#764ba2',
        accent_color: '#f093fb',
        background_color: '#ffffff',
        surface_color: '#f8fafc',
        text_color: '#1a202c',
        text_secondary: '#4a5568',
        border_color: '#e2e8f0',
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
        body_line_height: '1.6',
        custom_css: '',
        custom_footer_text: '',
        show_branding: true
      });
      setLogoPreview(null);
      setFaviconPreview(null);
      addNotification({
        type: 'info',
        title: 'Paramètres réinitialisés',
        message: 'Les paramètres ont été réinitialisés aux valeurs par défaut'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Palette className="w-6 h-6" />
            Marque Blanche
          </h1>
          <p className="text-gray-600 mt-1">
            Personnalisez l'apparence de votre plateforme
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Masquer' : 'Afficher'} l'aperçu
          </button>
          
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="space-y-6">
          {/* Informations de l'entreprise */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Informations de l'entreprise
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {logoPreview || settings?.logo_url ? (
                        <div className="space-y-2">
                          <img
                            src={logoPreview || settings?.logo_url}
                            alt="Logo"
                            className="w-16 h-16 mx-auto object-contain"
                          />
                          <p className="text-sm text-green-600">Logo sélectionné</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <p className="text-sm text-gray-600">Cliquez pour uploader</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favicon
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/x-icon,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFaviconUpload(file);
                      }}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                      {faviconPreview || settings?.favicon_url ? (
                        <div className="space-y-2">
                          <img
                            src={faviconPreview || settings?.favicon_url}
                            alt="Favicon"
                            className="w-8 h-8 mx-auto object-contain"
                          />
                          <p className="text-sm text-green-600">Favicon sélectionné</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <p className="text-sm text-gray-600">Cliquez pour uploader</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Palette de couleurs */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Palette de couleurs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'primary_color', label: 'Couleur principale', default: '#667eea' },
                { key: 'secondary_color', label: 'Couleur secondaire', default: '#764ba2' },
                { key: 'accent_color', label: 'Couleur d\'accent', default: '#f093fb' },
                { key: 'background_color', label: 'Couleur de fond', default: '#ffffff' },
                { key: 'surface_color', label: 'Couleur de surface', default: '#f8fafc' },
                { key: 'text_color', label: 'Couleur du texte', default: '#1a202c' },
                { key: 'text_secondary', label: 'Couleur secondaire', default: '#4a5568' },
                { key: 'border_color', label: 'Couleur des bordures', default: '#e2e8f0' }
              ].map(({ key, label, default: defaultValue }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={defaultValue}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration des polices */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Configuration des polices
            </h2>
            
            <div className="space-y-6">
              {/* Sélection des polices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_font', label: 'Police des titres' },
                  { key: 'subtitle_font', label: 'Police des sous-titres' },
                  { key: 'body_font', label: 'Police du corps' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <select
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => {
                        const font = e.target.value;
                        setFormData({ ...formData, [key]: font });
                        applyGoogleFont(font);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une police</option>
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.family} value={font.family}>
                          {font.family} {font.popular ? '⭐' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Tailles et poids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_font_size', label: 'Taille titre', default: '2rem' },
                  { key: 'subtitle_font_size', label: 'Taille sous-titre', default: '1.5rem' },
                  { key: 'body_font_size', label: 'Taille corps', default: '1rem' }
                ].map(({ key, label, default: defaultValue }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={defaultValue}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_font_weight', label: 'Poids titre', options: ['300', '400', '500', '600', '700'], default: '700' },
                  { key: 'subtitle_font_weight', label: 'Poids sous-titre', options: ['300', '400', '500', '600', '700'], default: '600' },
                  { key: 'body_font_weight', label: 'Poids corps', options: ['300', '400', '500', '600', '700'], default: '400' }
                ].map(({ key, label, options, default: defaultValue }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <select
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option} {option === defaultValue ? '(défaut)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Couleurs de texte */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_color', label: 'Couleur titre', default: '#1a202c' },
                  { key: 'subtitle_color', label: 'Couleur sous-titre', default: '#2d3748' },
                  { key: 'body_color', label: 'Couleur corps', default: '#4a5568' }
                ].map(({ key, label, default: defaultValue }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData[key as keyof BrandingFormData] as string}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData[key as keyof BrandingFormData] as string}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={defaultValue}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Espacement et hauteur de ligne */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_letter_spacing', label: 'Espacement titre', default: '-0.025em' },
                  { key: 'subtitle_letter_spacing', label: 'Espacement sous-titre', default: '0em' },
                  { key: 'body_letter_spacing', label: 'Espacement corps', default: '0em' }
                ].map(({ key, label, default: defaultValue }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={defaultValue}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'title_line_height', label: 'Hauteur ligne titre', default: '1.2' },
                  { key: 'subtitle_line_height', label: 'Hauteur ligne sous-titre', default: '1.4' },
                  { key: 'body_line_height', label: 'Hauteur ligne corps', default: '1.6' }
                ].map(({ key, label, default: defaultValue }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key as keyof BrandingFormData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={defaultValue}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Options avancées */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Options avancées
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texte du pied de page personnalisé
                </label>
                <input
                  type="text"
                  value={formData.custom_footer_text}
                  onChange={(e) => setFormData({ ...formData, custom_footer_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Texte personnalisé pour le pied de page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSS personnalisé
                </label>
                <textarea
                  value={formData.custom_css}
                  onChange={(e) => setFormData({ ...formData, custom_css: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="/* CSS personnalisé ici */"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="show_branding"
                  checked={formData.show_branding}
                  onChange={(e) => setFormData({ ...formData, show_branding: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="show_branding" className="text-sm font-medium text-gray-700">
                  Activer la marque blanche
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Aperçu en temps réel
                </h2>
                
                <div className="space-y-6">
                  {/* Aperçu des typographies */}
                  <div>
                    <h3 
                      style={{
                        fontFamily: formData.title_font,
                        fontSize: formData.title_font_size,
                        fontWeight: formData.title_font_weight,
                        color: formData.title_color,
                        letterSpacing: formData.title_letter_spacing,
                        lineHeight: formData.title_line_height
                      }}
                    >
                      Titre de démonstration
                    </h3>
                    <h4 
                      style={{
                        fontFamily: formData.subtitle_font,
                        fontSize: formData.subtitle_font_size,
                        fontWeight: formData.subtitle_font_weight,
                        color: formData.subtitle_color,
                        letterSpacing: formData.subtitle_letter_spacing,
                        lineHeight: formData.subtitle_line_height
                      }}
                      className="mt-4"
                    >
                      Sous-titre de démonstration
                    </h4>
                    <p 
                      style={{
                        fontFamily: formData.body_font,
                        fontSize: formData.body_font_size,
                        fontWeight: formData.body_font_weight,
                        color: formData.body_color,
                        letterSpacing: formData.body_letter_spacing,
                        lineHeight: formData.body_line_height
                      }}
                      className="mt-4"
                    >
                      Ceci est un exemple de texte pour démontrer l'apparence du corps du texte avec les paramètres sélectionnés. Vous pouvez voir comment la police, la taille, la couleur et l'espacement affectent la lisibilité globale.
                    </p>
                  </div>

                  {/* Aperçu des couleurs */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Palette de couleurs</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { key: 'primary_color', label: 'Principale' },
                        { key: 'secondary_color', label: 'Secondaire' },
                        { key: 'accent_color', label: 'Accent' },
                        { key: 'background_color', label: 'Fond' }
                      ].map(({ key, label }) => (
                        <div key={key} className="text-center">
                          <div 
                            className="w-full h-12 rounded-lg border border-gray-200 mb-1"
                            style={{ backgroundColor: formData[key as keyof BrandingFormData] as string }}
                          />
                          <p className="text-xs text-gray-600">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aperçu des composants */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Composants</h4>
                    <div className="space-y-3">
                      <button 
                        className="px-4 py-2 text-white rounded-lg"
                        style={{ backgroundColor: formData.primary_color }}
                      >
                        Bouton principal
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: formData.surface_color,
                          borderColor: formData.border_color,
                          color: formData.text_color
                        }}
                      >
                        Bouton secondaire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
