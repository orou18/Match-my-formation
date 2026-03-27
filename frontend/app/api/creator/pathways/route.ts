import { NextRequest, NextResponse } from "next/server";
import {
  getCreatorPathways,
  saveCreatorPathways,
} from "@/lib/server/learning-store";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: getCreatorPathways(),
    });
  } catch (error) {
    console.error("Pathways API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du chargement des parcours",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const pathways = getCreatorPathways();
    const newPathway = {
      id: Math.max(0, ...pathways.map((pathway) => pathway.id)) + 1,
      ...body,
      created_at: new Date().toISOString(),
      videos_count: Array.isArray(body.video_ids) ? body.video_ids.length : 0,
      assigned_employees: 0,
      is_active: true,
    };
    saveCreatorPathways([...pathways, newPathway]);

    return NextResponse.json({
      success: true,
      data: newPathway,
      message: "Parcours créé avec succès",
    });
  } catch (error) {
    console.error("Create Pathway Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du parcours",
      },
      { status: 500 }
    );
  }
}
