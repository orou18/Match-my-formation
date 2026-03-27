import { NextRequest, NextResponse } from "next/server";
import {
  createStudentAccount,
  findAccountByEmail,
} from "@/lib/server/account-store";

export async function POST(request: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    const { name, email, password, password_confirmation } = body;
    const role = "student";

    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400, headers }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas" },
        { status: 400, headers }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Veuillez entrer une adresse email valide" },
        { status: 400, headers }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400, headers }
      );
    }

    const existingUser = findAccountByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409, headers }
      );
    }

    const newUser = createStudentAccount({ name, email, password });
    const token = `mock-${role}-token-${newUser.id}-${Date.now()}`;

    return NextResponse.json(
      {
        message: "Inscription réussie",
        user: {
          id: Number(newUser.id),
          name: newUser.name,
          email: newUser.email,
          role,
          created_at: newUser.created_at,
        },
        token: token,
      },
      { headers }
    );
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de l'inscription" },
      { status: 500, headers }
    );
  }
}
