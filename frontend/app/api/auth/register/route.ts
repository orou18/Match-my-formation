import { NextRequest, NextResponse } from "next/server";
import { UserStore } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  // Headers CORS pour éviter les erreurs
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  try {
    console.log("🚀 API REGISTER - Début traitement");

    const body = await request.json();
    const { name, email, password, password_confirmation } = body;
    const role = "student"; // Toujours étudiant par défaut

    console.log("📋 Données reçues:", {
      name,
      email,
      role,
      hasPassword: !!password,
      hasConfirmation: !!password_confirmation,
    });

    // Validation des données
    if (!name || !email || !password || !password_confirmation) {
      console.log("❌ Validation: champs manquants");
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400, headers }
      );
    }

    if (password !== password_confirmation) {
      console.log("❌ Validation: passwords ne correspondent pas");
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas" },
        { status: 400, headers }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Validation: email invalide");
      return NextResponse.json(
        { message: "Veuillez entrer une adresse email valide" },
        { status: 400, headers }
      );
    }

    // Validation du mot de passe
    if (password.length < 8) {
      console.log("❌ Validation: mot de passe trop court");
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400, headers }
      );
    }

    console.log("✅ Validation réussie - Création utilisateur");

    // Vérifier si l'email existe déjà
    const existingUser = UserStore.findUserByEmail(email);
    if (existingUser) {
      console.log("❌ Email déjà utilisé:", email);
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409, headers }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: UserStore.getNextId(),
      name,
      email,
      password, // En production, hash le mot de passe!
      role,
      created_at: new Date().toISOString(),
    };

    // Ajouter à la base de données partagée
    UserStore.addUser(newUser);

    console.log("💾 Utilisateur sauvegardé:", newUser);
    console.log("📊 Total utilisateurs:", UserStore.getUsers().length);

    // Générer un token JWT simulé
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    console.log("✅ Inscription réussie pour:", email);

    return NextResponse.json(
      {
        message: "Inscription réussie",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at,
        },
        token: token,
      },
      { headers }
    );
  } catch (error) {
    console.error("❌ ERREUR API REGISTER:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de l'inscription" },
      { status: 500, headers }
    );
  }
}
