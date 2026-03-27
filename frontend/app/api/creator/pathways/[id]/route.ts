import { NextRequest, NextResponse } from "next/server";
import {
  getCreatorPathways,
  getPathwayAssignments,
  saveCreatorPathways,
  savePathwayAssignments,
} from "@/lib/server/learning-store";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pathwayId = Number(id);
    const pathways = getCreatorPathways();
    const nextPathways = pathways.filter((pathway) => pathway.id !== pathwayId);

    if (nextPathways.length === pathways.length) {
      return NextResponse.json(
        { success: false, message: "Parcours introuvable" },
        { status: 404 }
      );
    }

    saveCreatorPathways(nextPathways);
    savePathwayAssignments(
      getPathwayAssignments().filter(
        (assignment) => assignment.pathway_id !== pathwayId
      )
    );

    return NextResponse.json({
      success: true,
      message: "Parcours supprime avec succes",
    });
  } catch (error) {
    console.error("Delete Pathway Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression du parcours" },
      { status: 500 }
    );
  }
}
