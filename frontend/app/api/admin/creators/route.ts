import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  buildAdminCreator,
  getAdminCreators,
  getCreatorsStats,
  saveAdminCreators,
} from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const creators = getAdminCreators();
    let filteredCreators = creators;

    // Filtrage
    if (status && status !== "all") {
      filteredCreators = filteredCreators.filter(
        (creator) => creator.status === status
      );
    }
    if (category && category !== "all") {
      filteredCreators = filteredCreators.filter(
        (creator) => creator.category === category
      );
    }
    if (search) {
      filteredCreators = filteredCreators.filter(
        (creator) =>
          creator.name.toLowerCase().includes(search.toLowerCase()) ||
          creator.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      creators: filteredCreators,
      total: filteredCreators.length,
      stats: getCreatorsStats(creators),
    });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const creatorData = await request.json();

    // Validation
    if (!creatorData.name || !creatorData.email || !creatorData.category) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Créer un nouveau créateur
    const creators = getAdminCreators();
    if (
      creators.some(
        (creator) =>
          creator.email.toLowerCase() ===
          String(creatorData.email).toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    const newCreator = buildAdminCreator(creatorData, creators);
    saveAdminCreators([...creators, newCreator]);

    return NextResponse.json(newCreator, { status: 201 });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    const creators = getAdminCreators();
    const creatorIndex = creators.findIndex((creator) => creator.id === id);

    if (creatorIndex === -1) {
      return NextResponse.json(
        { error: "Créateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le créateur
    const updatedCreator = { ...creators[creatorIndex], ...updateData };
    creators[creatorIndex] = updatedCreator;
    saveAdminCreators(creators);

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    const creators = getAdminCreators();
    const creatorIndex = creators.findIndex((creator) => creator.id === id);

    if (creatorIndex === -1) {
      return NextResponse.json(
        { error: "Créateur non trouvé" },
        { status: 404 }
      );
    }

    creators.splice(creatorIndex, 1);
    saveAdminCreators(creators);

    return NextResponse.json({ message: "Créateur supprimé avec succès" });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
