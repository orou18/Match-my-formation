import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/auth';

// Base de données mock des parcours d'apprentissage
const mockParcoursData = {
  coursesInProgress: [
    {
      id: 1,
      title: "Histoire des sites touristiques du Bénin",
      module: "Module 4 sur 8 terminé",
      progress: 50,
      image: "/guide1.jpg",
      totalModules: 8,
      completedModules: 4,
      estimatedTime: "12h",
      difficulty: "Intermédiaire",
      instructor: {
        name: "Dr. Marie Laurent",
        avatar: "/avatars/creator1.jpg",
        specialty: "Histoire du Tourisme"
      },
      nextModule: {
        title: "Les royaumes d'Abomey",
        duration: "1h30",
        type: "video"
      }
    },
    {
      id: 2,
      title: "Techniques de communication touristique",
      module: "Module 7 sur 10 terminé",
      progress: 70,
      image: "/guide2.jpg",
      totalModules: 10,
      completedModules: 7,
      estimatedTime: "15h",
      difficulty: "Avancé",
      instructor: {
        name: "Sophie Martin",
        avatar: "/avatars/creator2.jpg",
        specialty: "Communication Touristique"
      },
      nextModule: {
        title: "Gestion des groupes multiculturels",
        duration: "2h",
        type: "interactive"
      }
    },
    {
      id: 3,
      title: "Patrimoine culturel et traditions locales",
      module: "Module 2 sur 6 terminé",
      progress: 33,
      image: "/guide1.jpg",
      totalModules: 6,
      completedModules: 2,
      estimatedTime: "8h",
      difficulty: "Débutant",
      instructor: {
        name: "Julie Bernard",
        avatar: "/avatars/creator3.jpg",
        specialty: "Patrimoine Culturel"
      },
      nextModule:      {
        title: "Les cérémonies traditionnelles",
        duration: "1h45",
        type: "video"
      }
    }
  ],
  recentModules: [
    {
      id: 1,
      title: "Les palais royaux d'Abomey",
      course: "Histoire des sites touristiques du Bénin",
      date: "12 janvier 2026",
      duration: "1h30",
      type: "video",
      completed: true,
      score: 85,
      certificate: {
        earned: true,
        downloadUrl: "/certificates/palais-abomey.pdf"
      }
    },
    {
      id: 2,
      title: "L'art de la narration touristique",
      course: "Techniques de communication touristique",
      date: "11 janvier 2026",
      duration: "2h",
      type: "interactive",
      completed: true,
      score: 92,
      certificate: {
        earned: false,
        downloadUrl: null
      }
    },
    {
      id: 3,
      title: "Les cérémonies vodoun",
      course: "Patrimoine culturel et traditions locales",
      date: "10 janvier 2026",
      duration: "1h45",
      type: "video",
      completed: true,
      score: 78,
      certificate: {
        earned: false,
        downloadUrl: null
      }
    },
    {
      id: 4,
      title: "Gestion des groupes touristiques",
      course: "Techniques de communication touristique",
      date: "09 janvier 2026",
      duration: "1h15",
      type: "workshop",
      completed: false,
      score: null,
      certificate: {
        earned: false,
        downloadUrl: null
      }
    }
  ],
  certifications: [
    {
      id: 1,
      title: "Certification Guide Touristique Professionnel",
      description: "Formation complète sur les techniques de guide touristique professionnel",
      date: "15 décembre 2024",
      status: "Obtenu",
      score: 88,
      downloadUrl: "/certificates/guide-touristique-pro.pdf",
      issuer: "MatchMyFormation",
      credentialId: "MTF-GTP-2024-001",
      expiresAt: null,
      skills: [
        "Communication touristique",
        "Gestion de groupes",
        "Connaissance historique",
        "Secourisme"
      ]
    },
    {
      id: 2,
      title: "Spécialisation Patrimoine Culturel",
      description: "Approfondissement des connaissances sur le patrimoine culturel béninois",
      progress: 68,
      status: "En cours",
      score: null,
      downloadUrl: null,
      issuer: "MatchMyFormation",
      credentialId: "MTF-SPC-2025-002",
      expiresAt: "2025-12-31",
      skills: [
        "Histoire du Bénin",
        "Patrimoine UNESCO",
        "Traditions locales",
        "Médiation culturelle"
      ],
      nextMilestone: {
        title: "Examen final",
        date: "15 février 2026",
        type: "exam"
      }
    },
    {
      id: 3,
      title: "Expert en Communication Touristique",
      description: "Niveau expert en communication et marketing touristique",
      progress: 45,
      status: "En cours",
      score: null,
      downloadUrl: null,
      issuer: "MatchMyFormation",
      credentialId: "MTF-ECT-2025-003",
      expiresAt: "2025-06-30",
      skills: [
        "Marketing touristique",
        "Communication digitale",
        "Relations clients",
        "Storytelling touristique"
      ],
      nextMilestone: {
        title: "Projet pratique",
        date: "01 mars 2026",
        type: "project"
      }
    }
  ],
  globalStats: {
    totalCourses: 3,
    completedCourses: 0,
    inProgressCourses: 3,
    totalHours: 35,
    completedHours: 15.5,
    averageScore: 85,
    streak: 7, // jours consécutifs
    rank: 12, // classement
    totalStudents: 1250
  }
};

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Simuler un délai de chargement pour l'effet réaliste
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: mockParcoursData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des parcours:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, courseId, moduleId } = body;

    // Gérer différentes actions
    switch (action) {
      case 'mark_module_complete':
        // Logique pour marquer un module comme complété
        console.log(`Module ${moduleId} du cours ${courseId} marqué comme complété par l'utilisateur ${userId}`);
        return NextResponse.json({
          success: true,
          message: "Module marqué comme complété",
          newProgress: Math.floor(Math.random() * 30) + 70 // Progression simulée
        });
        
      case 'update_progress':
        // Logique pour mettre à jour la progression
        console.log(`Progression mise à jour pour le cours ${courseId} par l'utilisateur ${userId}`);
        return NextResponse.json({
          success: true,
          message: "Progression mise à jour"
        });
        
      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des parcours:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
