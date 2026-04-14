import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorLibrary,
  saveCreatorLibrary,
} from "@/lib/server/creator-experience-store";

type SessionUser = { id?: string | number; role?: string };

// Stockage en mémoire pour les éléments de la bibliothèque
let libraryStore: any[] = [];

async function resolveCreatorId(request: NextRequest) {
  const tokenId = getUserIdFromToken(request);
  if (tokenId) return String(tokenId);
  const session = await getServerSession(authOptions);
  const user = (session?.user as SessionUser | undefined) || {};
  return user.id ? String(user.id) : "2";
}

export async function POST(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();

    // Récupérer les éléments actuels
    const items =
      libraryStore.length > 0 ? libraryStore : getCreatorLibrary(creatorId);

    if (body.action === "copy") {
      const { itemIds } = body;
      const itemsToCopy = items.filter((item) => itemIds.includes(item.id));

      // Créer des copies avec nouveaux IDs
      const copiedItems = itemsToCopy.map((item) => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        name: `${item.name} (copie)`,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }));

      // Ajouter les copies au stockage
      libraryStore = [...libraryStore, ...copiedItems];

      console.log(
        "Éléments copiés:",
        copiedItems.map((item) => item.name)
      );

      return NextResponse.json({
        success: true,
        message: "Éléments copiés avec succès",
        items: copiedItems,
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Batch library POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();

    // Récupérer les éléments actuels
    const items =
      libraryStore.length > 0 ? libraryStore : getCreatorLibrary(creatorId);

    if (body.action === "move") {
      const { itemIds, targetPath } = body;

      // Mettre à jour le chemin des éléments
      const updatedItems = items.map((item) =>
        itemIds.includes(item.id)
          ? { ...item, path: targetPath, modifiedAt: new Date().toISOString() }
          : item
      );

      libraryStore = updatedItems;

      console.log("Éléments déplacés vers:", targetPath);

      return NextResponse.json({
        success: true,
        message: "Éléments déplacés avec succès",
      });
    }

    if (body.action === "archive") {
      const { itemIds } = body;

      // Archiver les éléments (changer la visibilité)
      const updatedItems = items.map((item) =>
        itemIds.includes(item.id)
          ? {
              ...item,
              visibility: "archived",
              modifiedAt: new Date().toISOString(),
            }
          : item
      );

      libraryStore = updatedItems;

      console.log("Éléments archivés");

      return NextResponse.json({
        success: true,
        message: "Éléments archivés avec succès",
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Batch library PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const { itemIds } = body;

    // Récupérer les éléments actuels
    const items =
      libraryStore.length > 0 ? libraryStore : getCreatorLibrary(creatorId);

    // Supprimer les éléments
    const remainingItems = items.filter((item) => !itemIds.includes(item.id));
    libraryStore = remainingItems;

    console.log("Éléments supprimés:", itemIds.length);

    return NextResponse.json({
      success: true,
      message: "Éléments supprimés avec succès",
    });
  } catch (error) {
    console.error("Batch library DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
