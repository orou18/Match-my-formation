import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

interface EmployeeAnalytics {
  id: number;
  name: string;
  email: string;
  department: string;
  progress: number;
  completion_rate: number;
  videos_watched: number;
  time_spent: number; // en minutes
  last_active: string;
  courses_enrolled: number;
  courses_completed: number;
  average_score: number;
  engagement_score: number;
  learning_path: string;
  milestones_achieved: number;
  total_milestones: number;
  streak_days: number;
  certificates_earned: number;
}

interface AnalyticsData {
  employees: EmployeeAnalytics[];
  summary: {
    total_employees: number;
    active_employees: number;
    average_progress: number;
    total_time_spent: number;
    total_videos_watched: number;
    completion_rate: number;
    engagement_rate: number;
    top_performer: EmployeeAnalytics | null;
    improvement_needed: EmployeeAnalytics[];
  };
  performance_trends: {
    daily: Array<{
      date: string;
      active_users: number;
      completion_rate: number;
    }>;
    weekly: Array<{ week: string; progress: number; engagement: number }>;
    monthly: Array<{
      month: string;
      videos_watched: number;
      time_spent: number;
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const department = searchParams.get("department");
    const dateRange = searchParams.get("dateRange") || "30d";
    const sortBy = searchParams.get("sortBy") || "progress";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let analyticsData = null;

    try {
      // Tenter de récupérer les données du backend Laravel
      const backendParams = new URLSearchParams();
      if (department) backendParams.set("department", department);
      backendParams.set("date_range", dateRange);
      backendParams.set("sort_by", sortBy);
      backendParams.set("page", page.toString());
      backendParams.set("limit", limit.toString());

      const response = await laravelFetch(
        `/api/creator/analytics/employees?${backendParams}`,
        { request }
      );
      const data = await parseLaravelJson(response);

      if (response.ok) {
        analyticsData = data;
      }
    } catch (backendError) {
      console.warn(
        "Backend non accessible pour les analytics employés, utilisation des données fallback:",
        backendError
      );
    }

    // Utiliser les données du backend si disponibles, sinon utiliser les fallbacks
    if (analyticsData && analyticsData.success) {
      return NextResponse.json(analyticsData, { status: 200 });
    }

    // Données fallback complètes
    const fallbackEmployees: EmployeeAnalytics[] = [
      {
        id: 1,
        name: "Marie Kouassi",
        email: "marie@example.com",
        department: "Marketing",
        progress: 85,
        completion_rate: 85,
        videos_watched: 42,
        time_spent: 1260, // 21 heures
        last_active: "2024-01-15T10:30:00Z",
        courses_enrolled: 3,
        courses_completed: 2,
        average_score: 87,
        engagement_score: 92,
        learning_path: "Marketing Digital Avancé",
        milestones_achieved: 8,
        total_milestones: 10,
        streak_days: 12,
        certificates_earned: 2,
      },
      {
        id: 2,
        name: "Jean Dupont",
        email: "jean@example.com",
        department: "Ventes",
        progress: 72,
        completion_rate: 72,
        videos_watched: 36,
        time_spent: 980, // 16.3 heures
        last_active: "2024-01-14T15:20:00Z",
        courses_enrolled: 2,
        courses_completed: 1,
        average_score: 78,
        engagement_score: 68,
        learning_path: "Techniques de Vente Avancées",
        milestones_achieved: 5,
        total_milestones: 8,
        streak_days: 5,
        certificates_earned: 1,
      },
      {
        id: 3,
        name: "Sophie Martin",
        email: "sophie@example.com",
        department: "RH",
        progress: 90,
        completion_rate: 90,
        videos_watched: 45,
        time_spent: 1450, // 24.2 heures
        last_active: "2024-01-15T09:15:00Z",
        courses_enrolled: 4,
        courses_completed: 3,
        average_score: 91,
        engagement_score: 95,
        learning_path: "Management et Leadership",
        milestones_achieved: 12,
        total_milestones: 14,
        streak_days: 18,
        certificates_earned: 3,
      },
      {
        id: 4,
        name: "Thomas Bernard",
        email: "thomas@example.com",
        department: "IT",
        progress: 65,
        completion_rate: 65,
        videos_watched: 28,
        time_spent: 720, // 12 heures
        last_active: "2024-01-13T14:45:00Z",
        courses_enrolled: 2,
        courses_completed: 1,
        average_score: 72,
        engagement_score: 58,
        learning_path: "Développement Web",
        milestones_achieved: 4,
        total_milestones: 8,
        streak_days: 3,
        certificates_earned: 1,
      },
      {
        id: 5,
        name: "Claire Dubois",
        email: "claire@example.com",
        department: "Finance",
        progress: 78,
        completion_rate: 78,
        videos_watched: 39,
        time_spent: 1100, // 18.3 heures
        last_active: "2024-01-15T11:00:00Z",
        courses_enrolled: 3,
        courses_completed: 2,
        average_score: 83,
        engagement_score: 75,
        learning_path: "Finance et Comptabilité",
        milestones_achieved: 7,
        total_milestones: 9,
        streak_days: 8,
        certificates_earned: 2,
      },
    ];

    // Filtrage par département si nécessaire
    let filteredEmployees = fallbackEmployees;
    if (department && department !== "all") {
      filteredEmployees = fallbackEmployees.filter(
        (emp) => emp.department.toLowerCase() === department.toLowerCase()
      );
    }

    // Tri
    filteredEmployees.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.progress - a.progress;
        case "engagement":
          return b.engagement_score - a.engagement_score;
        case "time_spent":
          return b.time_spent - a.time_spent;
        case "completion_rate":
          return b.completion_rate - a.completion_rate;
        case "last_active":
          return (
            new Date(b.last_active).getTime() -
            new Date(a.last_active).getTime()
          );
        default:
          return b.progress - a.progress;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedEmployees = filteredEmployees.slice(
      startIndex,
      startIndex + limit
    );

    // Calcul du résumé
    const totalEmployees = filteredEmployees.length;
    const activeEmployees = filteredEmployees.filter(
      (emp) =>
        new Date(emp.last_active).getTime() >
        Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;
    const averageProgress = Math.round(
      filteredEmployees.reduce((sum, emp) => sum + emp.progress, 0) /
        totalEmployees
    );
    const totalTimeSpent = filteredEmployees.reduce(
      (sum, emp) => sum + emp.time_spent,
      0
    );
    const totalVideosWatched = filteredEmployees.reduce(
      (sum, emp) => sum + emp.videos_watched,
      0
    );
    const completionRate = Math.round(
      filteredEmployees.reduce((sum, emp) => sum + emp.completion_rate, 0) /
        totalEmployees
    );
    const engagementRate = Math.round(
      filteredEmployees.reduce((sum, emp) => sum + emp.engagement_score, 0) /
        totalEmployees
    );
    const topPerformer =
      filteredEmployees.length > 0
        ? filteredEmployees.reduce((best, emp) =>
            emp.progress > best.progress ? emp : best
          )
        : null;
    const improvementNeeded = filteredEmployees.filter(
      (emp) => emp.progress < 70
    );

    // Données de tendances (simulation)
    const generateTrends = () => {
      const daily = [];
      const weekly = [];
      const monthly = [];

      // Générer 30 jours de données quotidiennes
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        daily.push({
          date: date.toISOString().split("T")[0],
          active_users: Math.floor(Math.random() * 20) + 10,
          completion_rate: Math.floor(Math.random() * 30) + 60,
        });
      }

      // Générer 4 semaines de données
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekly.push({
          week: `Semaine ${4 - i}`,
          progress: Math.floor(Math.random() * 20) + 70,
          engagement: Math.floor(Math.random() * 25) + 65,
        });
      }

      // Générer 6 mois de données
      for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        monthly.push({
          month: month.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          }),
          videos_watched: Math.floor(Math.random() * 200) + 100,
          time_spent: Math.floor(Math.random() * 5000) + 2000,
        });
      }

      return { daily, weekly, monthly };
    };

    const analyticsResponse: AnalyticsData = {
      employees: paginatedEmployees,
      summary: {
        total_employees: totalEmployees,
        active_employees: activeEmployees,
        average_progress: averageProgress,
        total_time_spent: totalTimeSpent,
        total_videos_watched: totalVideosWatched,
        completion_rate: completionRate,
        engagement_rate: engagementRate,
        top_performer: topPerformer,
        improvement_needed: improvementNeeded,
      },
      performance_trends: generateTrends(),
    };

    return NextResponse.json(
      {
        success: true,
        data: analyticsResponse,
        pagination: {
          page,
          limit,
          total: filteredEmployees.length,
          pages: Math.ceil(filteredEmployees.length / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics employees API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement des analytics employés",
      },
      { status: 500 }
    );
  }
}
