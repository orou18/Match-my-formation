import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/user-store';

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

    console.log('🔑 API LOGIN - Tentative de connexion:', email);
    console.log('👥 Utilisateurs disponibles:', UserStore.getUsers().length);

    // Trouver l'utilisateur par email
    const user = UserStore.findUserByEmail(email);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    if (user.password !== password) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    console.log('✅ Connexion réussie pour:', email, 'ID:', user.id, 'Rôle:', user.role);

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
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}
