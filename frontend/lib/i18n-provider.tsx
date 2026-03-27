"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "fr" | "en" | "es";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  changeLanguage: (lang: Language) => void;
}

// Traductions
const translations = {
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.profile": "Mon profil",
    "nav.security": "Sécurité",
    "nav.preferences": "Préférences",
    "nav.billing": "Facturation",
    "nav.notifications": "Notifications",
    "nav.parcours": "Mes parcours",
    "nav.courses": "Formations",
    "nav.certificates": "Certifications",
    "nav.settings": "Paramètres",

    // Profil
    "profile.title": "Mon profil",
    "profile.personal_info": "Informations personnelles",
    "profile.name": "Nom",
    "profile.email": "Email",
    "profile.phone": "Téléphone",
    "profile.bio": "Biographie",
    "profile.location": "Localisation",
    "profile.website": "Site web",
    "profile.save": "Sauvegarder",
    "profile.cancel": "Annuler",
    "profile.edit": "Modifier",
    "profile.avatar": "Avatar",

    // Sécurité
    "security.title": "Sécurité",
    "security.password": "Mot de passe",
    "security.current_password": "Mot de passe actuel",
    "security.new_password": "Nouveau mot de passe",
    "security.confirm_password": "Confirmer le mot de passe",
    "security.two_factor": "Authentification à deux facteurs",
    "security.two_factor_enabled": "Activé",
    "security.two_factor_disabled": "Désactivé",
    "security.active_sessions": "Sessions actives",
    "security.change_password": "Changer le mot de passe",

    // Préférences
    "preferences.title": "Préférences",
    "preferences.notifications": "Notifications",
    "preferences.email_notifications": "Notifications par email",
    "preferences.push_notifications": "Notifications push",
    "preferences.newsletter": "Newsletter",
    "preferences.appearance": "Apparence",
    "preferences.theme": "Thème",
    "preferences.light_theme": "Clair",
    "preferences.dark_theme": "Sombre",
    "preferences.language": "Langue",
    "preferences.timezone": "Fuseau horaire",
    "preferences.save_preferences": "Enregistrer les préférences",

    // Parcours
    "parcours.title": "Mes parcours",
    "parcours.courses_in_progress": "Formations en cours",
    "parcours.recent_modules": "Derniers modules visionnés",
    "parcours.certifications": "Certifications",
    "parcours.progress": "Progression",
    "parcours.module": "Module",
    "parcours.completed": "Terminé",
    "parcours.in_progress": "En cours",
    "parcours.see_all": "Voir tout",

    // Messages génériques
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.yes": "Oui",
    "common.no": "Non",
    "common.ok": "OK",
    "common.close": "Fermer",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.date": "Date",
    "common.time": "Heure",
    "common.duration": "Durée",
    "common.status": "Statut",
    "common.actions": "Actions",
    "common.view": "Voir",
    "common.download": "Télécharger",
    "common.share": "Partager",
    "common.copy": "Copier",
    "common.paste": "Coller",
    "common.refresh": "Actualiser",
    "common.logout": "Déconnexion",
    "common.login": "Connexion",
    "common.register": "Inscription",
    "common.welcome": "Bienvenue",
    "common.goodbye": "Au revoir",
    "common.thank_you": "Merci",
    "common.please_wait": "Veuillez patienter...",
    "common.no_data": "Aucune donnée disponible",
    "common.no_results": "Aucun résultat trouvé",
    "common.try_again": "Réessayer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.submit": "Soumettre",
    "common.reset": "Réinitialiser",
    "common.clear": "Effacer",
    "common.select": "Sélectionner",
    "common.all": "Tout",
    "common.none": "Aucun",
    "common.saving": "Sauvegarde...",

    // Page de démo
    "demo.title": "Démonstration Thème & Traductions",
    "demo.subtitle": "Testez le changement de thème et de langue en temps réel",
    "demo.controls": "Contrôles",
    "demo.translations": "Traductions",
    "demo.theme_colors": "Couleurs du thème",
    "demo.interactive": "Test Interactif",
    "demo.icons": "Icônes du thème",
    "demo.instructions": "Instructions",
    "demo.increment": "Incrémenter",
    "demo.reset": "Réinitialiser",
    "demo.count_message": "Compteur actuel",
    "demo.instruction_theme":
      "Cliquez sur l'icône lune/soleil pour changer le thème",
    "demo.instruction_language":
      "Cliquez sur le drapeau pour changer la langue",
    "demo.instruction_persistence":
      "Les préférences sont sauvegardées automatiquement",
    "demo.instruction_refresh":
      "Rafraîchissez la page pour voir la persistance",

    // Préférences supplémentaires
    "preferences.notifications_desc": "Gérez vos préférences de notification",
    "preferences.email_notifications_desc":
      "Recevez les mises à jour par email",
    "preferences.push_notifications_desc": "Notifications sur votre appareil",
    "preferences.newsletter_desc": "Actualités et nouveautés",
    "preferences.appearance_desc": "Personnalisez l'interface",
    "preferences.language_region": "Langue et région",
    "preferences.language_region_desc":
      "Configurez vos préférences linguistiques",
    "preferences.change_language": "Changer de langue",
    "preferences.switch_to_light": "Passer au mode clair",
    "preferences.switch_to_dark": "Passer au mode sombre",
    "preferences.save_success": "Préférences sauvegardées avec succès",
    "preferences.updated": "Préférences mises à jour",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.profile": "My Profile",
    "nav.security": "Security",
    "nav.preferences": "Preferences",
    "nav.billing": "Billing",
    "nav.notifications": "Notifications",
    "nav.parcours": "My Learning Paths",
    "nav.courses": "Courses",
    "nav.certificates": "Certificates",
    "nav.settings": "Settings",

    // Profil
    "profile.title": "My Profile",
    "profile.personal_info": "Personal Information",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.phone": "Phone",
    "profile.bio": "Biography",
    "profile.location": "Location",
    "profile.website": "Website",
    "profile.save": "Save",
    "profile.cancel": "Cancel",
    "profile.edit": "Edit",
    "profile.avatar": "Avatar",

    // Sécurité
    "security.title": "Security",
    "security.password": "Password",
    "security.current_password": "Current Password",
    "security.new_password": "New Password",
    "security.confirm_password": "Confirm Password",
    "security.two_factor": "Two-Factor Authentication",
    "security.two_factor_enabled": "Enabled",
    "security.two_factor_disabled": "Disabled",
    "security.active_sessions": "Active Sessions",
    "security.change_password": "Change Password",

    // Préférences
    "preferences.title": "Preferences",
    "preferences.notifications": "Notifications",
    "preferences.email_notifications": "Email Notifications",
    "preferences.push_notifications": "Push Notifications",
    "preferences.newsletter": "Newsletter",
    "preferences.appearance": "Appearance",
    "preferences.theme": "Theme",
    "preferences.light_theme": "Light",
    "preferences.dark_theme": "Dark",
    "preferences.language": "Language",
    "preferences.timezone": "Timezone",
    "preferences.save_preferences": "Save Preferences",

    // Parcours
    "parcours.title": "My Learning Paths",
    "parcours.courses_in_progress": "Courses in Progress",
    "parcours.recent_modules": "Recent Modules",
    "parcours.certifications": "Certifications",
    "parcours.progress": "Progress",
    "parcours.module": "Module",
    "parcours.completed": "Completed",
    "parcours.in_progress": "In Progress",
    "parcours.see_all": "See All",

    // Messages génériques
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.close": "Close",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.date": "Date",
    "common.time": "Time",
    "common.duration": "Duration",
    "common.status": "Status",
    "common.actions": "Actions",
    "common.view": "View",
    "common.download": "Download",
    "common.share": "Share",
    "common.copy": "Copy",
    "common.paste": "Paste",
    "common.refresh": "Refresh",
    "common.logout": "Logout",
    "common.login": "Login",
    "common.register": "Register",
    "common.welcome": "Welcome",
    "common.goodbye": "Goodbye",
    "common.thank_you": "Thank you",
    "common.please_wait": "Please wait...",
    "common.no_data": "No data available",
    "common.no_results": "No results found",
    "common.try_again": "Try Again",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.clear": "Clear",
    "common.select": "Select",
    "common.all": "All",
    "common.none": "None",
    "common.saving": "Saving...",

    // Page de démo
    "demo.title": "Theme & Translations Demo",
    "demo.subtitle": "Test theme and language changes in real-time",
    "demo.controls": "Controls",
    "demo.translations": "Translations",
    "demo.theme_colors": "Theme Colors",
    "demo.interactive": "Interactive Test",
    "demo.icons": "Theme Icons",
    "demo.instructions": "Instructions",
    "demo.increment": "Increment",
    "demo.reset": "Reset",
    "demo.count_message": "Current counter",
    "demo.instruction_theme": "Click on the moon/sun icon to change theme",
    "demo.instruction_language": "Click on the flag to change language",
    "demo.instruction_persistence": "Preferences are saved automatically",
    "demo.instruction_refresh": "Refresh the page to see persistence",

    // Préférences supplémentaires
    "preferences.notifications_desc": "Manage your notification preferences",
    "preferences.email_notifications_desc": "Receive updates via email",
    "preferences.push_notifications_desc": "Notifications on your device",
    "preferences.newsletter_desc": "News and updates",
    "preferences.appearance_desc": "Customize the interface",
    "preferences.language_region": "Language and Region",
    "preferences.language_region_desc": "Configure your language preferences",
    "preferences.change_language": "Change Language",
    "preferences.switch_to_light": "Switch to Light Mode",
    "preferences.switch_to_dark": "Switch to Dark Mode",
    "preferences.save_success": "Preferences saved successfully",
    "preferences.updated": "Preferences updated",
  },
  es: {
    // Navigation
    "nav.dashboard": "Panel de Control",
    "nav.profile": "Mi Perfil",
    "nav.security": "Seguridad",
    "nav.preferences": "Preferencias",
    "nav.billing": "Facturación",
    "nav.notifications": "Notificaciones",
    "nav.parcours": "Mis Rutas de Aprendizaje",
    "nav.courses": "Cursos",
    "nav.certificates": "Certificados",
    "nav.settings": "Configuración",

    // Profil
    "profile.title": "Mi Perfil",
    "profile.personal_info": "Información Personal",
    "profile.name": "Nombre",
    "profile.email": "Email",
    "profile.phone": "Teléfono",
    "profile.bio": "Biografía",
    "profile.location": "Ubicación",
    "profile.website": "Sitio Web",
    "profile.save": "Guardar",
    "profile.cancel": "Cancelar",
    "profile.edit": "Editar",
    "profile.avatar": "Avatar",

    // Sécurité
    "security.title": "Seguridad",
    "security.password": "Contraseña",
    "security.current_password": "Contraseña Actual",
    "security.new_password": "Nueva Contraseña",
    "security.confirm_password": "Confirmar Contraseña",
    "security.two_factor": "Autenticación de Dos Factores",
    "security.two_factor_enabled": "Activado",
    "security.two_factor_disabled": "Desactivado",
    "security.active_sessions": "Sesiones Activas",
    "security.change_password": "Cambiar Contraseña",

    // Préférences
    "preferences.title": "Preferencias",
    "preferences.notifications": "Notificaciones",
    "preferences.email_notifications": "Notificaciones por Email",
    "preferences.push_notifications": "Notificaciones Push",
    "preferences.newsletter": "Boletín",
    "preferences.appearance": "Apariencia",
    "preferences.theme": "Tema",
    "preferences.light_theme": "Claro",
    "preferences.dark_theme": "Oscuro",
    "preferences.language": "Idioma",
    "preferences.timezone": "Zona Horaria",
    "preferences.save_preferences": "Guardar Preferencias",

    // Parcours
    "parcours.title": "Mis Rutas de Aprendizaje",
    "parcours.courses_in_progress": "Cursos en Progreso",
    "parcours.recent_modules": "Módulos Recientes",
    "parcours.certifications": "Certificaciones",
    "parcours.progress": "Progreso",
    "parcours.module": "Módulo",
    "parcours.completed": "Completado",
    "parcours.in_progress": "En Progreso",
    "parcours.see_all": "Ver Todo",

    // Messages génériques
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.yes": "Sí",
    "common.no": "No",
    "common.ok": "OK",
    "common.close": "Cerrar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.date": "Fecha",
    "common.time": "Hora",
    "common.duration": "Duración",
    "common.status": "Estado",
    "common.actions": "Acciones",
    "common.view": "Ver",
    "common.download": "Descargar",
    "common.share": "Compartir",
    "common.copy": "Copiar",
    "common.paste": "Pegar",
    "common.refresh": "Actualizar",
    "common.logout": "Cerrar Sesión",
    "common.login": "Iniciar Sesión",
    "common.register": "Registrarse",
    "common.welcome": "Bienvenido",
    "common.goodbye": "Adiós",
    "common.thank_you": "Gracias",
    "common.please_wait": "Por favor espere...",
    "common.no_data": "No hay datos disponibles",
    "common.no_results": "No se encontraron resultados",
    "common.try_again": "Intentar de Nuevo",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.submit": "Enviar",
    "common.reset": "Restablecer",
    "common.clear": "Limpiar",
    "common.select": "Seleccionar",
    "common.all": "Todo",
    "common.none": "Ninguno",
    "common.saving": "Guardando...",

    // Page de démo
    "demo.title": "Demostración Tema y Traducciones",
    "demo.subtitle": "Pruebe los cambios de tema e idioma en tiempo real",
    "demo.controls": "Controles",
    "demo.translations": "Traducciones",
    "demo.theme_colors": "Colores del Tema",
    "demo.interactive": "Prueba Interactiva",
    "demo.icons": "Iconos del Tema",
    "demo.instructions": "Instrucciones",
    "demo.increment": "Incrementar",
    "demo.reset": "Restablecer",
    "demo.count_message": "Contador actual",
    "demo.instruction_theme":
      "Haga clic en el ícono luna/sol para cambiar el tema",
    "demo.instruction_language":
      "Haga clic en la bandera para cambiar el idioma",
    "demo.instruction_persistence":
      "Las preferencias se guardan automáticamente",
    "demo.instruction_refresh": "Actualice la página para ver la persistencia",

    // Préférences supplémentaires
    "preferences.notifications_desc":
      "Gestione sus preferencias de notificación",
    "preferences.email_notifications_desc": "Reciba actualizaciones por email",
    "preferences.push_notifications_desc": "Notificaciones en su dispositivo",
    "preferences.newsletter_desc": "Noticias y novedades",
    "preferences.appearance_desc": "Personalice la interfaz",
    "preferences.language_region": "Idioma y Región",
    "preferences.language_region_desc": "Configure sus preferencias de idioma",
    "preferences.change_language": "Cambiar Idioma",
    "preferences.switch_to_light": "Cambiar a Modo Claro",
    "preferences.switch_to_dark": "Cambiar a Modo Oscuro",
    "preferences.save_success": "Preferencias guardadas con éxito",
    "preferences.updated": "Preferencias actualizadas",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Récupérer la langue depuis localStorage ou navigator.language
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["fr", "en", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language.split("-")[0];
      const defaultLang = ["fr", "en", "es"].includes(browserLang)
        ? (browserLang as Language)
        : "fr";
      setLanguageState(defaultLang);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Sauvegarder dans localStorage
    localStorage.setItem("language", language);

    // Mettre à jour l'attribut lang sur l'élément html
    document.documentElement.lang = language;

    // Mettre à jour la direction (RTL/LTR si nécessaire)
    document.documentElement.dir = "ltr";
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const changeLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === "string") {
      return value;
    }

    // Fallback vers français si la traduction n'existe pas
    let fallbackValue: any = translations.fr;
    for (const k of keys) {
      fallbackValue = fallbackValue?.[k];
    }

    if (typeof fallbackValue === "string") {
      return fallbackValue;
    }

    // Fallback vers le paramètre ou la clé
    return fallback || key;
  };

  // Éviter le flash de traduction au chargement
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, t, changeLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
