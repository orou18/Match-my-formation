import { NextRequest, NextResponse } from "next/server";
import {
  ensureUserRecords,
  findAccountByEmail,
  updateLastLogin,
} from "@/lib/server/account-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Veuillez entrer une adresse email valide" },
        { status: 400 }
      );
    }

    const user = findAccountByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    updateLastLogin(user.id);
    ensureUserRecords(user.id, user.role);
    const token = `mock-${user.role}-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      message: "Connexion réussie",
      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar || `/avatars/${user.role}.jpg`,
      },
      token,
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la connexion" },
      { status: 500 }
    );
  }
}
