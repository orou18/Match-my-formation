import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Création employé avec les données:", payload);

    // Appeler l'API Laravel pour créer l'employé
    const response = await laravelFetch('/api/creator/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const result = await parseLaravelJson(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Erreur lors de la création de l'employé",
        },
        { status: response.status }
      );
    }

    console.log("Employé créé avec succès:", result.data);
    return NextResponse.json(result, { status: 201 });

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

    // Appeler l'API Laravel pour modifier l'employé
    const response = await laravelFetch(`/api/creator/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    const result = await parseLaravelJson(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Erreur lors de la modification de l'employé",
        },
        { status: response.status }
      );
    }

    console.log("Employé modifié avec succès:", result.data);
    return NextResponse.json(
      {
        success: true,
        message: "Employé modifié avec succès",
        data: result.data,
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

    // Appeler l'API Laravel pour supprimer l'employé
    const response = await laravelFetch(`/api/creator/employees/${id}`, {
      method: 'DELETE',
    });

    const result = await parseLaravelJson(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Erreur lors de la suppression de l'employé",
        },
        { status: response.status }
      );
    }

    console.log("Employé supprimé avec succès:", result.data);
    return NextResponse.json(
      {
        success: true,
        message: "Employé supprimé avec succès",
        data: result.data,
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
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    // Vérifier si c'est une demande pour un employé spécifique ou la liste
    const isSpecificEmployee = id && id !== 'employees' && !isNaN(parseInt(id));

    if (isSpecificEmployee) {
      console.log("Récupération détails employé ID:", id);

      // Appeler l'API Laravel pour récupérer les détails de l'employé
      const response = await laravelFetch(`/api/creator/employees/${id}`, {
        method: 'GET',
      });

      const result = await parseLaravelJson(response);

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: result.message || "Erreur lors de la récupération des détails de l'employé",
          },
          { status: response.status }
        );
      }

      console.log("Détails employé récupérés:", result.data);
      return NextResponse.json(result, { status: 200 });
    } else {
      console.log("Récupération de la liste des employés...");

      // Appeler l'API Laravel pour récupérer les employés
      const response = await laravelFetch('/api/creator/employees');
      const result = await parseLaravelJson(response);

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: result.message || "Erreur lors de la récupération des employés",
          },
          { status: response.status }
        );
      }

      console.log("Employés récupérés:", result.data);
      return NextResponse.json(result, { status: 200 });
    }

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
