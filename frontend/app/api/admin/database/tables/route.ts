import { NextRequest, NextResponse } from "next/server";

// Simuler les données de la base de données pour la démonstration
const tableData = {
  users: { count: 1250 },
  videos: { count: 3420 },
  courses: { count: 156 },
  modules: { count: 89 },
  pathways: { count: 23 },
  chat_messages: { count: 5678 },
  video_likes: { count: 8934 },
  analytics: { count: 4567 },
};

export async function GET() {
  try {
    // Dans un vrai projet, vous feriez une requête à votre base de données Laravel
    // const tables = await DB::select("SELECT table_name, COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE()");

    const tables = Object.entries(tableData).map(([name, data]) => ({
      name,
      count: data.count,
      icon: getIconForTable(name),
      color: getColorForTable(name),
      description: getDescriptionForTable(name),
    }));

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Erreur lors de la récupération des tables:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tables" },
      { status: 500 }
    );
  }
}

function getIconForTable(tableName: string) {
  const icons: { [key: string]: string } = {
    users: "Users",
    videos: "Video",
    courses: "BookOpen",
    modules: "Database",
    pathways: "TrendingUp",
    chat_messages: "MessageSquare",
    video_likes: "Heart",
    analytics: "BarChart3",
  };
  return icons[tableName] || "Database";
}

function getColorForTable(tableName: string) {
  const colors: { [key: string]: string } = {
    users: "from-blue-500 to-blue-600",
    videos: "from-purple-500 to-purple-600",
    courses: "from-green-500 to-green-600",
    modules: "from-orange-500 to-orange-600",
    pathways: "from-pink-500 to-pink-600",
    chat_messages: "from-indigo-500 to-indigo-600",
    video_likes: "from-red-500 to-red-600",
    analytics: "from-cyan-500 to-cyan-600",
  };
  return colors[tableName] || "from-gray-500 to-gray-600";
}

function getDescriptionForTable(tableName: string) {
  const descriptions: { [key: string]: string } = {
    users: "Utilisateurs de la plateforme",
    videos: "Vidéos des créateurs",
    courses: "Cours et formations",
    modules: "Modules d'apprentissage",
    pathways: "Parcours d'apprentissage",
    chat_messages: "Messages du chat",
    video_likes: "Likes sur les vidéos",
    analytics: "Statistiques et analytics",
  };
  return descriptions[tableName] || "Table de données";
}
