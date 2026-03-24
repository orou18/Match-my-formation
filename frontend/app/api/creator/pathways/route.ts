import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data pour les parcours
    const mockPathways = [
      {
        id: 1,
        title: "Formation Complète Hôtellerie",
        description: "Parcours complet pour former les employés à tous les aspects de l'hôtellerie, de l'accueil à la gestion",
        domain: "Hôtellerie",
        duration_hours: 40,
        difficulty_level: "beginner",
        is_active: true,
        videos_count: 12,
        assigned_employees: 25,
        created_at: new Date().toISOString(),
        videos: [
          {
            id: 1,
            title: "Introduction à l'hôtellerie",
            description: "Découvrez les bases du métier",
            duration: "15:30",
            thumbnail: "/hotel-intro.jpg"
          },
          {
            id: 2,
            title: "Techniques de service client",
            description: "Apprenez à gérer les clients",
            duration: "22:45",
            thumbnail: "/customer-service.jpg"
          }
        ]
      },
      {
        id: 2,
        title: "Restauration Excellence",
        description: "Formation complète en restauration pour les chefs de cuisine et le personnel de restaurant",
        domain: "Restauration",
        duration_hours: 60,
        difficulty_level: "intermediate",
        is_active: true,
        videos_count: 18,
        assigned_employees: 15,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: "Tourisme et Accueil",
        description: "Parcours spécialisé dans l'accueil touristique et la gestion des visites",
        domain: "Tourisme",
        duration_hours: 35,
        difficulty_level: "beginner",
        is_active: true,
        videos_count: 10,
        assigned_employees: 30,
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockPathways
    });

  } catch (error) {
    console.error('Pathways API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors du chargement des parcours" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock création de parcours
    const newPathway = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString(),
      videos_count: 0,
      assigned_employees: 0
    };

    return NextResponse.json({
      success: true,
      data: newPathway,
      message: "Parcours créé avec succès"
    });

  } catch (error) {
    console.error('Create Pathway Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la création du parcours" 
      },
      { status: 500 }
    );
  }
}
