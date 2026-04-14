import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  buildAdminUser,
  getAdminUsers,
  getUsersStats,
  saveAdminUsers,
} from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const users = getAdminUsers();
    let filteredUsers = users;

    // Filtrage
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }
    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status);
    }
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      users: filteredUsers,
      total: filteredUsers.length,
      stats: getUsersStats(users),
    });
  } catch (error) {
    console.error("ADMIN USERS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userData = await request.json();

    // Validation
    if (!userData.name || !userData.email || !userData.role) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Créer un nouvel utilisateur
    const users = getAdminUsers();
    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === String(userData.email).toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    const newUser = buildAdminUser(userData, users);
    saveAdminUsers([...users, newUser]);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("ADMIN USERS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    const users = getAdminUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = { ...users[userIndex], ...updateData };
    users[userIndex] = updatedUser;
    saveAdminUsers(users);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ADMIN USERS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    const users = getAdminUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);
    saveAdminUsers(users);

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("ADMIN USERS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
