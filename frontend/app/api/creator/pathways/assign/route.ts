import { NextRequest, NextResponse } from "next/server";
import {
  getCreatorPathways,
  getPathwayAssignments,
  saveCreatorPathways,
  savePathwayAssignments,
} from "@/lib/server/learning-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pathwayId = Number(body.pathway_id);
    const employeeId = Number(body.employee_id);

    if (!pathwayId || !employeeId) {
      return NextResponse.json(
        { success: false, message: "Parcours et employe requis" },
        { status: 400 }
      );
    }

    const assignments = getPathwayAssignments();
    const alreadyAssigned = assignments.some(
      (assignment) =>
        assignment.pathway_id === pathwayId &&
        assignment.employee_id === employeeId
    );

    if (!alreadyAssigned) {
      assignments.push({
        pathway_id: pathwayId,
        employee_id: employeeId,
        assigned_at: new Date().toISOString(),
      });
      savePathwayAssignments(assignments);

      const pathways = getCreatorPathways();
      const index = pathways.findIndex((pathway) => pathway.id === pathwayId);
      if (index !== -1) {
        pathways[index] = {
          ...pathways[index],
          assigned_employees: (pathways[index].assigned_employees || 0) + 1,
        };
        saveCreatorPathways(pathways);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Parcours assigne avec succes",
    });
  } catch (error) {
    console.error("Assign Pathway Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'assignation du parcours" },
      { status: 500 }
    );
  }
}
