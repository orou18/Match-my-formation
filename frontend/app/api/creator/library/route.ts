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

export async function GET(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    
    // Utiliser le stockage en mémoire si disponible, sinon utiliser le store
    if (libraryStore.length > 0) {
      return NextResponse.json({ items: libraryStore });
    }
    
    const items = getCreatorLibrary(creatorId);
    libraryStore = items; // Mettre en cache
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Creator library API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    
    let body;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      // Gérer les FormData (upload de fichiers)
      const formData = await request.formData();
      body = {
        name: formData.get("name"),
        type: formData.get("type"),
        size: formData.get("size"),
        visibility: formData.get("visibility"),
        path: formData.get("path"),
        tags: []
      };
    } else {
      // Gérer les JSON (création de dossiers)
      body = await request.json();
    }
    
    const newItem = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      size: body.size,
      duration: body.duration,
      thumbnail: body.thumbnail,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      tags: body.tags || [],
      visibility: body.visibility || "private",
      starred: false,
      path: body.path || "/",
      children: body.children || []
    };
    
    // Ajouter au stockage en mémoire
    libraryStore.push(newItem);
    
    console.log("Nouvel élément ajouté à la bibliothèque:", newItem);
    
    return NextResponse.json({ 
      success: true, 
      message: "Élément ajouté avec succès",
      item: newItem 
    });
  } catch (error) {
    console.error("Creator library add error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const items = libraryStore.length > 0 ? libraryStore : getCreatorLibrary(creatorId);
    const next = items.map((item) =>
      item.id === String(body.id)
        ? { ...item, starred: body.starred ?? !item.starred }
        : item
    );
    
    // Mettre à jour le stockage en mémoire
    libraryStore = next;
    
    return NextResponse.json({ items: next });
  } catch (error) {
    console.error("Creator library update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    
    // Supprimer du stockage en mémoire
    libraryStore = libraryStore.filter(item => item.id !== id);
    
    console.log("Élément supprimé de la bibliothèque:", id);
    
    return NextResponse.json({ 
      success: true, 
      message: "Élément supprimé avec succès" 
    });
  } catch (error) {
    console.error("Creator library delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
