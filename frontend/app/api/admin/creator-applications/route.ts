import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  createCreatorApplication,
  getCreatorApplications,
  reviewCreatorApplication,
} from "@/lib/server/account-store";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return NextResponse.json({
      applications: getCreatorApplications(),
    });
  } catch {
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
    const result = createCreatorApplication({
      userId,
      studentName: String(body.studentName || ""),
      studentEmail: String(body.studentEmail || ""),
      motivation: String(body.motivation || ""),
      expertise: String(body.expertise || ""),
      category: String(body.category || "General"),
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(
      {
        message: "Demande envoyée à l'administration",
        application: result.application,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const reviewed = reviewCreatorApplication(String(body.id || ""), {
      status: body.status === "approved" ? "approved" : "rejected",
      reviewedBy: String(session.user.email || session.user.name || "admin"),
      reviewMessage: body.reviewMessage
        ? String(body.reviewMessage)
        : undefined,
    });

    if (!reviewed) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      message:
        reviewed.status === "approved"
          ? "Demande approuvée et accès créateur généré"
          : "Demande refusée",
      application: reviewed,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
