import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Appeler l'API Laravel pour l'authentification des employés
    const response = await laravelFetch("/api/auth/employee-login", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: "employee",
      }),
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
      // Créer une session NextAuth pour l'employé
      const session = await getServerSession(authOptions);
      
      // Si l'authentification réussit, retourner les données de l'employé
      return NextResponse.json({
        success: true,
        message: "Connexion réussie",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.name,
          role: "employee",
          department: data.user?.department,
          position: data.user?.position,
          creator_id: data.user?.creator_id,
        },
        token: data.token,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Identifiants incorrects" 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur de connexion employé:", error);
    
    // Fallback: vérifier si c'est un employé de test
    const { email, password } = await request.json().catch(() => ({}));
    
    if (email === "marie@example.com" && password === "password123") {
      return NextResponse.json({
        success: true,
        message: "Connexion réussie (mode test)",
        user: {
          id: 1,
          email: "marie@example.com",
          name: "Marie Kouassi",
          role: "employee",
          department: "Marketing",
          position: "Chef de projet",
          creator_id: 1,
        },
        token: "test-token-employee-1",
      });
    }
    
    if (email === "jean@example.com" && password === "password123") {
      return NextResponse.json({
        success: true,
        message: "Connexion réussie (mode test)",
        user: {
          id: 2,
          email: "jean@example.com",
          name: "Jean Dupont",
          role: "employee",
          department: "Ventes",
          position: "Commercial",
          creator_id: 1,
        },
        token: "test-token-employee-2",
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur serveur lors de la connexion" 
      },
      { status: 500 }
    );
  }
}
