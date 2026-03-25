import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simuler les données d'un nouvel étudiant
    const studentData = {
      user: {
        id: 0, // Sera remplacé par l'ID réel
        name: "Nouvel Étudiant",
        email: "student@example.com",
        role: "student",
        created_at: new Date().toISOString()
      },
      stats: {
        courses_completed: 0,
        courses_in_progress: 0,
        total_learning_time: 0,
        certificates_earned: 0,
        average_score: 0,
        streak_days: 0
      },
      recent_activity: [],
      achievements: [],
      recommended_courses: [],
      progress: {
        overall: 0,
        by_category: {}
      }
    };

    return NextResponse.json(studentData);
  } catch (error) {
    console.error('Student dashboard error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
