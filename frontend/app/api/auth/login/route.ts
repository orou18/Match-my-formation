import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe sont obligatoires' },
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

    // Trouver l'utilisateur par email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer un token JWT (simulation)
    const token = `mock-jwt-token-${Date.now()}-${user.id}`;

    // Retourner la réponse avec les données utilisateur et le token
    return NextResponse.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}
