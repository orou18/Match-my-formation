import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const { email, login_id, password } = await request.json();

    if ((!email && !login_id) || !password) {
      return NextResponse.json(
        { message: "Email ou ID de connexion et mot de passe requis" },
        { status: 400 }
      );
    }

    // Appeler l'API Laravel pour l'authentification des employés
    const response = await laravelFetch("/api/employee/login", {
      request,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        login_id,
        password,
      }),
    });

    const data = await parseLaravelJson(response);

    if (response.ok && data.success) {
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
          message: data.message || "Identifiants incorrects",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur de connexion employé:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Backend employé indisponible",
      },
      { status: 502 }
    );
  }
}
