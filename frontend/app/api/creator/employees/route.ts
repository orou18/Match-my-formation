import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data pour les employés
    const mockEmployees = [
      {
        id: 1,
        name: "Marie Dubois",
        email: "marie.dubois@entreprise.com",
        phone: "+33 6 12 34 56 78",
        department: "Hôtellerie",
        position: "Réceptionniste",
        status: "active",
        hire_date: "2023-01-15",
        completion_rate: 85,
        progress: 72,
      },
      {
        id: 2,
        name: "Jean Martin",
        email: "jean.martin@entreprise.com",
        phone: "+33 6 23 45 67 89",
        department: "Restauration",
        position: "Chef de rang",
        status: "active",
        hire_date: "2023-03-20",
        completion_rate: 92,
        progress: 88,
      },
      {
        id: 3,
        name: "Sophie Bernard",
        email: "sophie.bernard@entreprise.com",
        phone: "+33 6 34 56 78 90",
        department: "Tourisme",
        position: "Guide touristique",
        status: "active",
        hire_date: "2023-02-10",
        completion_rate: 78,
        progress: 65,
      },
      {
        id: 4,
        name: "Pierre Petit",
        email: "pierre.petit@entreprise.com",
        phone: "+33 6 45 67 89 01",
        department: "Commerce",
        position: "Vendeur",
        status: "inactive",
        hire_date: "2023-04-05",
        completion_rate: 45,
        progress: 32,
      },
      {
        id: 5,
        name: "Claire Robert",
        email: "claire.robert@entreprise.com",
        phone: "+33 6 56 78 90 12",
        department: "Hôtellerie",
        position: "Gouvernante",
        status: "active",
        hire_date: "2023-05-12",
        completion_rate: 96,
        progress: 91,
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockEmployees
    });

  } catch (error) {
    console.error('Employees API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors du chargement des employés" 
      },
      { status: 500 }
    );
  }
}
