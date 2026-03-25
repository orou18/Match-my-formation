import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API REGISTER - Début traitement');
    
    const body = await request.json();
    const { name, email, password, password_confirmation, role = 'student' } = body;
    
    console.log('📋 Données reçues:', { name, email, role, hasPassword: !!password, hasConfirmation: !!password_confirmation });

    // Validation des données
    if (!name || !email || !password || !password_confirmation) {
      console.log('❌ Validation: champs manquants');
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      console.log('❌ Validation: passwords ne correspondent pas');
      return NextResponse.json(
        { message: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation: email invalide');
      return NextResponse.json(
        { message: 'Veuillez entrer une adresse email valide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 8) {
      console.log('❌ Validation: mot de passe trop court');
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    console.log('✅ Validation réussie - Création utilisateur');

    // Créer le nouvel utilisateur
    const newUserData = {
      id: Date.now(), // ID unique basé sur timestamp
      name,
      email,
      role,
      created_at: new Date().toISOString()
    };

    // Simuler une base de données avec persistance
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Vérifier si l'email existe déjà
    if (existingUsers.some((user: any) => user.email === email)) {
      console.log('❌ Email déjà utilisé:', email);
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Ajouter le nouvel utilisateur
    existingUsers.push(newUserData);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    
    console.log('💾 Utilisateur sauvegardé:', newUserData);
    console.log('📊 Total utilisateurs:', existingUsers.length);

    // Générer un token JWT simulé
    const jwtToken = `mock-jwt-token-${newUserData.id}-${Date.now()}`;

    console.log('✅ Inscription réussie pour:', email);

    return NextResponse.json({
      message: "Inscription réussie",
      user: newUserData,
      token: jwtToken
    });

  } catch (error) {
    console.error('❌ ERREUR API REGISTER:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
