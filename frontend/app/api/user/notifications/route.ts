import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Récupérer les notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Mock notifications - Remplacer par appel à votre base de données
    const notifications = [
      {
        id: "1",
        title: "Nouveau cours disponible",
        message: "React Avancé est maintenant disponible dans votre parcours",
        type: "info" as const,
        category: "course" as const,
        isRead: false,
        createdAt: "2024-06-18T10:30:00Z",
        actionUrl: "/courses/react-advanced",
        metadata: { courseName: "React Avancé", instructor: "Jean Dupont" },
      },
      {
        id: "2",
        title: "Félicitations !",
        message: "Vous avez terminé le cours TypeScript avec succès",
        type: "success" as const,
        category: "achievement" as const,
        isRead: false,
        createdAt: "2024-06-17T15:45:00Z",
        metadata: { courseName: "TypeScript" },
      },
      {
        id: "3",
        title: "Message de votre instructeur",
        message:
          "Bonjour ! J'ai regardé votre dernier exercice, excellent travail.",
        type: "info" as const,
        category: "message" as const,
        isRead: true,
        createdAt: "2024-06-16T09:20:00Z",
        metadata: { instructor: "Marie Curie" },
      },
      {
        id: "4",
        title: "Maintenance système",
        message: "La plateforme sera en maintenance demain de 2h à 4h",
        type: "warning" as const,
        category: "system" as const,
        isRead: true,
        createdAt: "2024-06-15T14:00:00Z",
      },
      {
        id: "5",
        title: "Offre spéciale",
        message: "-30% sur tous les cours premium cette semaine",
        type: "info" as const,
        category: "marketing" as const,
        isRead: false,
        createdAt: "2024-06-14T11:30:00Z",
        metadata: { amount: "-30%" },
      },
    ];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
