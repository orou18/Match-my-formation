import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

// Stockage en mémoire pour les employés (pour les tests)
let employeesStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Création employé avec les données:", payload);

    // Vérifier si l'email existe déjà
    const existingEmployee = employeesStore.find(
      (emp) => emp.email === payload.email
    );
    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Un employé avec cet email existe déjà",
        },
        { status: 400 }
      );
    }

    // Créer un nouvel employé
    const newEmployee = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      department: payload.department || "Général",
      position: payload.position || "Employé",
      domain: payload.department || "general",
      status: "active",
      progress: 0,
      completion_rate: 0,
      enrolled_courses: 0,
      completed_courses: 0,
      last_login: null,
      created_at: new Date().toISOString(),
    };

    // Ajouter au stockage
    employeesStore.push(newEmployee);

    // Générer les identifiants de connexion
    const loginCredentials = {
      email: payload.email,
      password: "password123",
    };

    console.log("Employé créé avec succès:", newEmployee);
    console.log("Total employés dans le store:", employeesStore.length);

    return NextResponse.json(
      {
        success: true,
        message: "Employé créé avec succès",
        data: newEmployee,
        login_credentials: loginCredentials,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de l'ajout de l'employé",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    const { id, ...updateData } = payload;

    console.log("Modification employé ID:", id, "avec données:", updateData);

    // Trouver l'employé dans le stockage
    const employeeIndex = employeesStore.findIndex(
      (emp) => emp.id === parseInt(id)
    );
    if (employeeIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Employé non trouvé",
        },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre employé
    if (updateData.email) {
      const existingEmployee = employeesStore.find(
        (emp) => emp.email === updateData.email && emp.id !== parseInt(id)
      );
      if (existingEmployee) {
        return NextResponse.json(
          {
            success: false,
            message: "Un autre employé utilise déjà cet email",
          },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'employé
    const updatedEmployee = {
      ...employeesStore[employeeIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    employeesStore[employeeIndex] = updatedEmployee;

    console.log("Employé modifié avec succès:", updatedEmployee);

    return NextResponse.json(
      {
        success: true,
        message: "Employé modifié avec succès",
        data: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la modification de l'employé",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log("Suppression employé ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de l'employé requis",
        },
        { status: 400 }
      );
    }

    // Trouver l'employé dans le stockage
    const employeeIndex = employeesStore.findIndex(
      (emp) => emp.id === parseInt(id)
    );
    if (employeeIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Employé non trouvé",
        },
        { status: 404 }
      );
    }

    // Supprimer l'employé
    const deletedEmployee = employeesStore[employeeIndex];
    employeesStore.splice(employeeIndex, 1);

    console.log("Employé supprimé avec succès:", deletedEmployee);
    console.log("Total employés restants:", employeesStore.length);

    return NextResponse.json(
      {
        success: true,
        message: "Employé supprimé avec succès",
        data: deletedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete employee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la suppression de l'employé",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Récupération de la liste des employés...");
    console.log("Nombre d'employés dans le store:", employeesStore.length);

    // Utiliser les employés du stockage en mémoire
    if (employeesStore.length > 0) {
      return NextResponse.json(
        {
          success: true,
          data: employeesStore,
          total: employeesStore.length,
        },
        { status: 200 }
      );
    }

    // Données fallback si aucun employé n'a été créé
    const fallbackEmployees = [
      {
        id: 1,
        name: "Marie Kouassi",
        email: "marie@example.com",
        department: "Marketing",
        position: "Chef de projet",
        status: "active",
        progress: 85,
        completion_rate: 85,
        enrolled_courses: 3,
        completed_courses: 2,
        last_login: "2024-01-15T10:30:00Z",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Jean Dupont",
        email: "jean@example.com",
        department: "Ventes",
        position: "Commercial",
        status: "active",
        progress: 72,
        completion_rate: 72,
        enrolled_courses: 2,
        completed_courses: 1,
        last_login: "2024-01-14T15:20:00Z",
        created_at: "2024-01-02T00:00:00Z",
      },
      {
        id: 3,
        name: "Sophie Martin",
        email: "sophie@example.com",
        department: "RH",
        position: "Responsable formation",
        status: "active",
        progress: 90,
        completion_rate: 90,
        enrolled_courses: 4,
        completed_courses: 3,
        last_login: "2024-01-15T09:15:00Z",
        created_at: "2024-01-03T00:00:00Z",
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: fallbackEmployees,
        total: fallbackEmployees.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get employees error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des employés",
      },
      { status: 500 }
    );
  }
}
