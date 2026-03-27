import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import {
  getStudentParcours,
  saveStudentParcours,
} from "@/lib/server/learning-store";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Simuler un délai de chargement pour l'effet réaliste
    await new Promise((resolve) => setTimeout(resolve, 300));

    const parcoursData = getStudentParcours();
    return NextResponse.json({
      success: true,
      data: parcoursData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des parcours:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { action, courseId, moduleId } = body;
    const parcours = getStudentParcours();

    // Gérer différentes actions
    switch (action) {
      case "mark_module_complete": {
        const index = parcours.coursesInProgress.findIndex(
          (course: { id: number }) => course.id === Number(courseId)
        );
        if (index === -1) {
          return NextResponse.json(
            { error: "Cours introuvable" },
            { status: 404 }
          );
        }

        const course = parcours.coursesInProgress[index];
        const completedModules = Math.min(
          course.totalModules,
          course.completedModules + 1
        );
        const progress = Math.round(
          (completedModules / course.totalModules) * 100
        );

        parcours.coursesInProgress[index] = {
          ...course,
          completedModules,
          progress,
          module: `Module ${completedModules} sur ${course.totalModules} termine`,
        };
        parcours.globalStats.completedCourses =
          parcours.coursesInProgress.filter(
            (item: { progress: number }) => item.progress >= 100
          ).length;
        parcours.globalStats.inProgressCourses =
          parcours.coursesInProgress.filter(
            (item: { progress: number }) => item.progress < 100
          ).length;
        parcours.globalStats.completedHours = Math.min(
          parcours.globalStats.totalHours,
          Number((parcours.globalStats.completedHours + 1.5).toFixed(1))
        );
        parcours.recentModules.unshift({
          id: Date.now(),
          title: `Module ${moduleId || completedModules} complete`,
          course: course.title,
          date: new Date().toLocaleDateString("fr-FR"),
          duration: course.nextModule?.duration || "1h",
          type: course.nextModule?.type || "video",
          completed: true,
          score: 100,
          certificate: {
            earned: progress >= 100,
            downloadUrl: progress >= 100 ? "/certificates/generated.pdf" : null,
          },
        });
        saveStudentParcours(parcours);
        return NextResponse.json({
          success: true,
          message: "Module marqué comme complété",
          newProgress: progress,
        });
      }

      case "update_progress": {
        const index = parcours.coursesInProgress.findIndex(
          (course: { id: number }) => course.id === Number(courseId)
        );
        if (index === -1) {
          return NextResponse.json(
            { error: "Cours introuvable" },
            { status: 404 }
          );
        }

        const nextProgress = Math.max(
          0,
          Math.min(
            100,
            Number(body.progress ?? parcours.coursesInProgress[index].progress)
          )
        );
        const totalModules = parcours.coursesInProgress[index].totalModules;
        const completedModules = Math.round(
          (nextProgress / 100) * totalModules
        );
        parcours.coursesInProgress[index] = {
          ...parcours.coursesInProgress[index],
          progress: nextProgress,
          completedModules,
          module: `Module ${completedModules} sur ${totalModules} termine`,
        };
        saveStudentParcours(parcours);
        return NextResponse.json({
          success: true,
          message: "Progression mise à jour",
          progress: nextProgress,
        });
      }

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des parcours:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
