import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  buildAdminCreator,
  getAdminCreators,
  getCreatorsStats,
  saveAdminCreators,
} from "@/lib/server/admin-store";
import {
  createStudentAccount,
  findAccountByEmail,
  getAccounts,
  getCreatorApplications,
  reviewCreatorApplication,
  updateAccount,
} from "@/lib/server/account-store";

type SessionUser = {
  id?: string | number;
  role?: string;
  email?: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const creators = getAdminCreators();
    const accountCreators = getAccounts()
      .filter((account) => account.role === "creator")
      .map((account) => ({
        id: account.id,
        name: account.name,
        email: account.email,
        status:
          account.status === "pending" || account.status === "suspended"
            ? account.status
            : "active",
        joinDate: account.joinDate,
        courses: 0,
        students: 0,
        revenue: 0,
        rating: 0,
        totalViews: 0,
        category: "Creator",
        avatar: account.avatar || "/temoignage.png",
        bio: account.bio || "",
        expertise: account.bio || "",
        verified: account.role === "creator",
        featured: false,
      }));
    const pendingApplications = getCreatorApplications()
      .filter((application) => application.status === "pending")
      .map((application) => ({
        id: `application-${application.id}`,
        name: application.studentName,
        email: application.studentEmail,
        status: "pending",
        joinDate: application.createdAt.split("T")[0],
        courses: 0,
        students: 0,
        revenue: 0,
        rating: 0,
        totalViews: 0,
        category: application.category,
        avatar: "/temoignage.png",
        bio: application.motivation,
        expertise: application.expertise,
        verified: false,
        featured: false,
      }));

    let filteredCreators = [
      ...creators,
      ...accountCreators,
      ...pendingApplications,
    ].filter(
      (creator, index, list) =>
        list.findIndex((item) => item.email === creator.email) === index
    );

    // Filtrage
    if (status && status !== "all") {
      filteredCreators = filteredCreators.filter(
        (creator) => creator.status === status
      );
    }
    if (category && category !== "all") {
      filteredCreators = filteredCreators.filter(
        (creator) => creator.category === category
      );
    }
    if (search) {
      filteredCreators = filteredCreators.filter(
        (creator) =>
          creator.name.toLowerCase().includes(search.toLowerCase()) ||
          creator.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      creators: filteredCreators,
      total: filteredCreators.length,
      stats: getCreatorsStats(creators),
    });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const creatorData = await request.json();

    // Validation
    if (!creatorData.name || !creatorData.email || !creatorData.category) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    if (findAccountByEmail(String(creatorData.email))) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const creators = getAdminCreators();
    if (
      creators.some(
        (creator) =>
          creator.email.toLowerCase() ===
          String(creatorData.email).toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    const newCreator = buildAdminCreator(creatorData, creators);
    saveAdminCreators([...creators, newCreator]);
    createStudentAccount({
      name: String(creatorData.name),
      email: String(creatorData.email),
      password: "CreatorTemp!2026",
    });
    const account = findAccountByEmail(String(creatorData.email));
    if (account) {
      updateAccount(account.id, {
        role: "creator",
        status: "active",
        subscription: "PRO",
      });
    }

    return NextResponse.json(newCreator, { status: 201 });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    if (String(id).startsWith("application-")) {
      const applicationId = String(id).replace("application-", "");
      const status = updateData.status === "active" ? "approved" : "rejected";
      const reviewed = reviewCreatorApplication(applicationId, {
        status,
        reviewedBy: String(sessionUser?.email || "admin"),
        reviewMessage: updateData.reviewMessage,
      });

      if (!reviewed) {
        return NextResponse.json(
          { error: "Demande créateur introuvable" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: `application-${reviewed.id}`,
        name: reviewed.studentName,
        email: reviewed.studentEmail,
        status: reviewed.status === "approved" ? "active" : "suspended",
        joinDate: reviewed.createdAt.split("T")[0],
        courses: 0,
        students: 0,
        revenue: 0,
        rating: 0,
        totalViews: 0,
        category: reviewed.category,
        avatar: "/temoignage.png",
      });
    }

    const creators = getAdminCreators();
    const creatorIndex = creators.findIndex((creator) => creator.id === id);

    if (creatorIndex === -1) {
      return NextResponse.json(
        { error: "Créateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le créateur
    const updatedCreator = { ...creators[creatorIndex], ...updateData };
    creators[creatorIndex] = updatedCreator;
    saveAdminCreators(creators);

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID créateur requis" },
        { status: 400 }
      );
    }

    if (String(id).startsWith("application-")) {
      const applicationId = String(id).replace("application-", "");
      const reviewed = reviewCreatorApplication(applicationId, {
        status: "rejected",
        reviewedBy: String(sessionUser?.email || "admin"),
        reviewMessage: "Demande rejetée par l'administration",
      });
      if (!reviewed) {
        return NextResponse.json(
          { error: "Demande créateur introuvable" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Demande rejetée avec succès" });
    }

    const creators = getAdminCreators();
    const creatorIndex = creators.findIndex((creator) => creator.id === id);

    if (creatorIndex === -1) {
      return NextResponse.json(
        { error: "Créateur non trouvé" },
        { status: 404 }
      );
    }

    creators.splice(creatorIndex, 1);
    saveAdminCreators(creators);

    return NextResponse.json({ message: "Créateur supprimé avec succès" });
  } catch (error) {
    console.error("ADMIN CREATORS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
