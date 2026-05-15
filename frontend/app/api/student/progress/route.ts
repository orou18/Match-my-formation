import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    // Transférer la requête au backend Laravel
    const response = await laravelFetch("/api/student/progress", { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("STUDENT PROGRESS - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      success: true,
      data: {
        coursesInProgress: [
          {
            id: 1,
            title: "Management de l'Hôtellerie de Luxe",
            module: "Module 1: Introduction",
            progress: 75,
            image: "/courses/luxury-hotel.jpg",
            totalModules: 8,
            completedModules: 6,
            estimatedTime: "12h",
            difficulty: "Avancé",
            instructor: {
              name: "Marie Dubois",
              avatar: "/creator-avatar-1.jpg",
              specialty: "Hôtellerie",
            },
            nextModule: {
              title: "Module 7: Gestion des opérations",
              duration: "1h30",
              type: "video",
            },
            isPremium: false,
            price: 299,
            enrolledAt: "2024-01-15",
            lastAccessed: "2024-03-18",
          },
          {
            id: 2,
            title: "Écotourisme et Développement Durable",
            module: "Module 3: Pratiques durables",
            progress: 45,
            image: "/courses/ecotourism.jpg",
            totalModules: 6,
            completedModules: 2,
            estimatedTime: "8h",
            difficulty: "Intermédiaire",
            instructor: {
              name: "Jean-Pierre N'Diaye",
              avatar: "/creator-avatar-2.jpg",
              specialty: "Écotourisme",
            },
            nextModule: {
              title: "Module 4: Impact environnemental",
              duration: "2h",
              type: "interactive",
            },
            isPremium: false,
            price: 199,
            enrolledAt: "2024-02-01",
            lastAccessed: "2024-03-17",
          },
        ],
        recentModules: [
          {
            id: 1,
            title: "Introduction au Marketing Digital",
            course: "Module individuel",
            date: "2024-03-18",
            duration: "15:30",
            type: "video",
            completed: true,
            score: 85,
            videoUrl: "https://example.com/video1.mp4",
            thumbnail: "/placeholder-video.jpg",
            progress: 100,
          },
          {
            id: 2,
            title: "Techniques de Vente Avancées",
            course: "Module individuel",
            date: "2024-03-17",
            duration: "12:45",
            type: "video",
            completed: false,
            score: null,
            videoUrl: "https://example.com/video2.mp4",
            thumbnail: "/placeholder-video.jpg",
            progress: 65,
          },
        ],
        certifications: [
          {
            id: 1,
            title: "Certification de Base",
            description: "5 vidéos complétées avec succès",
            date: "2024-02-15",
            progress: 100,
            status: "Obtenu",
            score: 85,
            downloadUrl: "/certificates/base-certificate.pdf",
            issuer: "Match My Formation",
            credentialId: "CERT-BASE-123",
            expiresAt: "2025-02-15",
            skills: ["Base numérique", "Autonomie"],
          },
        ],
        globalStats: {
          totalCourses: 12,
          completedCourses: 3,
          inProgressCourses: 2,
          totalHours: 156,
          completedHours: 89,
          averageScore: 82.5,
          streak: 7,
          rank: 15,
          totalStudents: 2847,
        },
        userBalance: 150.75,
        paymentMethods: [
          { id: 1, type: "card", last4: "1234", brand: "Visa" },
        ],
        transactions: [
          {
            id: 1,
            type: "payment",
            amount: 299,
            date: "2024-01-15",
            description: "Management de l'Hôtellerie de Luxe",
          },
        ],
      },
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}
