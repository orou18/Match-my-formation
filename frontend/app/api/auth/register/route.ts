import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, password_confirmation, role = 'student' } = body;

    // Validation des données
    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Veuillez entrer une adresse email valide' },
        { status: 400 }
      );
    }

    // Simulation d'une base de données utilisateurs
    // En production, vous utiliseriez une vraie base de données
    const users = [
      {
        id: 1,
        name: 'Étudiant Test',
        email: 'student@match.com',
        password: 'Azerty123!',
        role: 'student'
      },
      {
        id: 2,
        name: 'Créateur Test',
        email: 'creator@match.com',
        password: 'Azerty123!',
        role: 'creator'
      },
      {
        id: 3,
        name: 'Admin Test',
        email: 'admin@match.com',
        password: 'Azerty123!',
        role: 'admin'
      }
    ];

    // Vérifier si l'email existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // En production, hash le mot de passe!
      role
    };

    // Générer un token JWT (simulation)
    const token = `mock-jwt-token-${Date.now()}-${newUser.id}`;

    // Retourner la réponse avec les données utilisateur et le token
    return NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
