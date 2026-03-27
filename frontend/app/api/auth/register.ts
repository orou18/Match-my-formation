import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API REGISTER SIMPLE");

    const body = await request.json();
    const {
      name,
      email,
      password,
      password_confirmation,
      role = "student",
    } = body;

    console.log("📋 Données:", { name, email, role });

    // Validation simple
    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    // Créer utilisateur
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      created_at: new Date().toISOString(),
    };

    // Token simple
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    console.log("✅ Utilisateur créé:", newUser);

    return NextResponse.json({
      message: "Inscription réussie",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
