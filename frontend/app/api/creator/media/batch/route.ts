import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getCreatorLibrary,
  saveCreatorLibrary,
} from "@/lib/server/creator-experience-store";

type SessionUser = { id?: string | number; role?: string };

// Stockage en mémoire pour les médias
let mediaStore: any[] = [];

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
    
    // Récupérer les médias actuels
    const items = mediaStore.length > 0 ? mediaStore : [];
    
    if (body.action === "copy") {
      const { itemIds } = body;
      const itemsToCopy = items.filter(item => itemIds.includes(item.id));
      
      // Créer des copies avec nouveaux IDs
      const copiedItems = itemsToCopy.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        name: `${item.name} (copie)`,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }));
      
      // Ajouter les copies au stockage
      mediaStore = [...mediaStore, ...copiedItems];
      
      console.log("Médias copiés:", copiedItems.map(item => item.name));
      
      return NextResponse.json({ 
        success: true, 
        message: "Médias copiés avec succès",
        items: copiedItems 
      });
    }
    
    return NextResponse.json({ error: "Action non supportée" }, { status: 400 });
    
  } catch (error) {
    console.error("Batch media POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    
    // Récupérer les médias actuels
    const items = mediaStore.length > 0 ? mediaStore : [];
    
    if (body.action === "move") {
      const { itemIds, targetPath } = body;
      
      // Mettre à jour le chemin des éléments
      const updatedItems = items.map(item => 
        itemIds.includes(item.id) 
          ? { ...item, url: targetPath + "/" + item.name, modifiedAt: new Date().toISOString() }
          : item
      );
      
      mediaStore = updatedItems;
      
      console.log("Médias déplacés vers:", targetPath);
      
      return NextResponse.json({ 
        success: true, 
        message: "Médias déplacés avec succès"
      });
    }
    
    if (body.action === "archive") {
      const { itemIds } = body;
      
      // Archiver les médias (changer le metadata)
      const updatedItems = items.map(item => 
        itemIds.includes(item.id) 
          ? { 
              ...item, 
              metadata: { ...item.metadata, archived: true }, 
              modifiedAt: new Date().toISOString() 
            }
          : item
      );
      
      mediaStore = updatedItems;
      
      console.log("Médias archivés");
      
      return NextResponse.json({ 
        success: true, 
        message: "Médias archivés avec succès"
      });
    }
    
    return NextResponse.json({ error: "Action non supportée" }, { status: 400 });
    
  } catch (error) {
    console.error("Batch media PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const creatorId = await resolveCreatorId(request);
    const body = await request.json();
    const { itemIds } = body;
    
    // Récupérer les médias actuels
    const items = mediaStore.length > 0 ? mediaStore : [];
    
    // Supprimer les médias
    const remainingItems = items.filter(item => !itemIds.includes(item.id));
    mediaStore = remainingItems;
    
    console.log("Médias supprimés:", itemIds.length);
    
    return NextResponse.json({ 
      success: true, 
      message: "Médias supprimés avec succès"
    });
    
  } catch (error) {
    console.error("Batch media DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
