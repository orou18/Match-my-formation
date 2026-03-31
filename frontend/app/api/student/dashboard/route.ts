import { NextRequest, NextResponse } from "next/server";
import { parseLaravelJson } from "@/lib/api/laravel-proxy";
import {
  fetchBackendWithRequestAuth,
  getRequestAccessToken,
} from "@/lib/api/request-backend";

export async function GET(request: NextRequest) {
  try {
    if (!getRequestAccessToken(request)) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const [userResponse, coursesResponse] = await Promise.all([
      fetchBackendWithRequestAuth(request, "/api/me"),
      fetchBackendWithRequestAuth(request, "/api/student/courses"),
    ]);

    const [userPayload, coursesPayload] = await Promise.all([
      parseLaravelJson(userResponse),
      parseLaravelJson(coursesResponse),
    ]);

    if (!userResponse.ok || !coursesResponse.ok) {
      return NextResponse.json(
        {
          error:
            userPayload?.message ||
            userPayload?.error ||
            coursesPayload?.message ||
            coursesPayload?.error ||
            "Impossible de charger le dashboard étudiant",
        },
        {
          status: userResponse.ok
            ? coursesResponse.status
            : userResponse.status,
        }
      );
    }

    const courses = Array.isArray(coursesPayload) ? coursesPayload : [];

    return NextResponse.json({
      user: userPayload,
      courses,
      stats: {
        courses_completed: 0,
        courses_in_progress: courses.length,
        total_learning_time: 0,
        certificates_earned: 0,
        average_score: 0,
        streak_days: 0,
      },
      recent_activity: courses.slice(0, 3).map((course: any) => ({
        id: course.id,
        title: course.title,
        type: "course_available",
      })),
      achievements: [],
      recommended_courses: courses.slice(0, 4),
      progress: {
        overall: 0,
        by_category: {},
      },
    });
  } catch (error) {
    console.error("Student dashboard proxy error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
