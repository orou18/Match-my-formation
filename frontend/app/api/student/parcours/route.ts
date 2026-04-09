import { NextRequest, NextResponse } from "next/server";
import UserIdManager from "@/lib/user-id-manager";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
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

    // Appeler le backend Laravel pour récupérer les parcours détaillés de l'étudiant
    const parcoursResponse = await fetch(`${BACKEND_URL}/api/student/parcours`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!parcoursResponse.ok) {
      console.error("Backend parcours error:", parcoursResponse.status);
      return NextResponse.json({ 
        success: false, 
        error: "Erreur lors de la récupération des parcours" 
      }, { status: parcoursResponse.status });
    }

    const parcoursData = await parcoursResponse.json();
    
    if (!parcoursData.success) {
      return NextResponse.json({ 
        success: false, 
        error: parcoursData.message || "Erreur backend" 
      }, { status: 400 });
    }

    // Les données sont déjà au bon format grâce au backend
    return NextResponse.json({
      success: true,
      data: parcoursData.data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des parcours:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur de connexion au serveur" 
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
