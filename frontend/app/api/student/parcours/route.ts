import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";
import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Fonctions utilitaires pour lire les données locales
async function readJsonStore(filename: string, defaultValue: any = []) {
  try {
    const filePath = path.join(process.cwd(), ".data", `${filename}.json`);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

// Transformer les données pour correspondre à l'interface attendue
function transformParcoursData(parcours: any[], videoProgress: any[], userData: any) {
  return {
    coursesInProgress: parcours.map((course: any) => ({
      id: course.id || 1,
      title: course.title || "Formation Web Complète",
      description: course.description || "Apprenez le développement web moderne",
      progress: course.progress || 75,
      totalModules: course.totalModules || 12,
      completedModules: course.completedModules || 9,
      thumbnail: course.thumbnail || "/guide1.jpg",
      instructor: course.instructor || "Expert Tech",
      duration: course.duration || "8h 30min",
      level: course.level || "Intermédiaire",
      category: course.category || "Développement",
      rating: course.rating || 4.8,
      enrolledAt: course.enrolledAt || "2024-01-15",
      lastAccessed: course.lastAccessed || "2024-03-10",
      isCompleted: course.isCompleted || false,
      certificateUrl: course.certificateUrl || null,
    })),
    recentModules: [
      {
        id: 1,
        title: "Introduction à React",
        courseTitle: "Formation React Avancé",
        progress: 85,
        duration: "45min",
        lastWatched: "Il y a 2 heures",
        thumbnail: "/guide1.jpg",
        isCompleted: false,
      },
      {
        id: 2,
        title: "Les Hooks personnalisés",
        courseTitle: "Formation React Avancé",
        progress: 60,
        duration: "1h 15min",
        lastWatched: "Hier",
        thumbnail: "/guide1.jpg",
        isCompleted: false,
      },
    ],
    certifications: [
      {
        id: 1,
        title: "Certification React",
        issuer: "Tech Academy",
        issueDate: "2024-02-15",
        expiryDate: "2025-02-15",
        credentialId: "REACT-2024-001",
        verifyUrl: "https://verify.techacademy.com/REACT-2024-001",
        pdfUrl: "/certificates/react-2024.pdf",
      },
    ],
    globalStats: {
      totalCourses: parcours.length || 3,
      completedCourses: parcours.filter((c: any) => c.isCompleted).length || 1,
      inProgressCourses: parcours.filter((c: any) => !c.isCompleted).length || 2,
      totalHours: 24.5,
      completedHours: 18.5,
      averageScore: 85,
      streak: 7,
      rank: 15,
      totalStudents: 1000,
    },
    userBalance: 250.75,
    paymentMethods: [
      {
        id: 1,
        type: "card",
        brand: "visa",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
    ],
    transactions: [
      {
        id: 1,
        type: "purchase",
        amount: 99.99,
        currency: "EUR",
        status: "completed",
        description: "Formation React Avancé",
        date: "2024-03-01",
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification avec UserIdManager
    const userData = UserIdManager.getStoredUserData();
    
    if (!userData || !userData.id) {
      // Retourner des données par défaut si pas d'utilisateur
      const defaultData = transformParcoursData([], [], {
        id: 1,
        name: "Étudiant",
        email: "student@example.com",
        role: "student"
      });
      
      return NextResponse.json({
        success: true,
        data: defaultData,
      });
    }

    // Appeler l'API backend Laravel pour récupérer les parcours détaillés
    const response = await fetch(`${BACKEND_URL}/api/student/parcours/${userData.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UserIdManager.getToken()}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return NextResponse.json({
          success: true,
          data: data.data,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: data.message || "Erreur lors de la récupération des parcours",
        });
      }
    } else {
      // En cas d'erreur backend, utiliser les données locales
      const parcours = await readJsonStore("student-parcours", []);
      const videoProgress = await readJsonStore("video-progress", []);
      
      // Transformer les données pour correspondre à l'interface attendue
      const transformedData = transformParcoursData(parcours, videoProgress, userData);
      
      return NextResponse.json({
        success: true,
        data: transformedData,
      });
    }
  } catch (error) {
    console.error("Erreur parcours:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur de connexion au serveur"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification avec UserIdManager
    const userData = UserIdManager.getStoredUserData();
    
    if (!userData || !userData.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Non authentifié" 
      }, { status: 401 });
    }

    // Récupérer le token d'authentification
    const token = localStorage.getItem("token") || UserIdManager.getToken();
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Token d'authentification manquant" 
      }, { status: 401 });
    }

    const body = await request.json();
    const { action, courseId, moduleId, progress } = body;

    // Appeler le backend Laravel pour mettre à jour la progression
    const progressResponse = await fetch(`${BACKEND_URL}/api/employee/progress/update`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        pathway_id: courseId,
        video_id: moduleId,
        progress_percentage: progress || 0,
        action: action,
      }),
    });

    if (!progressResponse.ok) {
      console.error("Backend progress update error:", progressResponse.status);
      return NextResponse.json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de la progression" 
      }, { status: progressResponse.status });
    }

    const progressData = await progressResponse.json();
    
    if (!progressData.success) {
      return NextResponse.json({ 
        success: false, 
        error: progressData.message || "Erreur backend" 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Progression mise à jour avec succès",
      newProgress: progress,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des parcours:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur de connexion au serveur" 
    }, { status: 500 });
  }
}
