import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  allPermissions,
  buildAdminAdmin,
  getAdminAdmins,
  getAdminsStats,
  saveAdminAdmins,
} from "@/lib/server/admin-store";
import {
  createStudentAccount,
  findAccountByEmail,
  getAccounts,
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
    const search = searchParams.get("search");

    const admins = getAdminAdmins();
    const accountAdmins = getAccounts()
      .filter((account) => account.role === "admin" || account.role === "super_admin")
      .map((account) => ({
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        permissions: account.permissions || [],
        status: account.status,
        lastLogin: account.lastLogin || "",
        avatar: account.avatar || "/temoignage.png",
        createdAt: account.created_at,
      }));
    let filteredAdmins = admins;
    filteredAdmins = [...filteredAdmins, ...accountAdmins].filter(
      (admin, index, list) =>
        list.findIndex((item) => item.email === admin.email) === index
    );

    if (search) {
      filteredAdmins = filteredAdmins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      admins: filteredAdmins,
      total: filteredAdmins.length,
      permissions: allPermissions,
      stats: getAdminsStats(admins),
    });
  } catch (error) {
    console.error("ADMIN ADMINS - Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "super_admin") {
      return NextResponse.json(
        { error: "Non autorisé - Super Admin requis" },
        { status: 401 }
      );
    }

    const adminData = await request.json();
    const role = String(adminData.role || "admin");

    // Validation
    if (!adminData.name || !adminData.email || !adminData.role) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Déterminer les permissions selon le rôle
    const admins = getAdminAdmins();
    if (findAccountByEmail(String(adminData.email))) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    if (
      admins.some(
        (admin) =>
          admin.email.toLowerCase() === String(adminData.email).toLowerCase()
      )
    ) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    const newAdmin = buildAdminAdmin(adminData, admins);
    saveAdminAdmins([...admins, newAdmin]);
    createStudentAccount({
      name: String(adminData.name),
      email: String(adminData.email),
      password: "AdminTemp!2026",
    });
    const account = findAccountByEmail(String(adminData.email));
    if (account) {
      updateAccount(account.id, {
        role: role as "admin" | "super_admin",
        status: "active",
        permissions: newAdmin.permissions,
        subscription: "ADMIN",
      });
    }

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error("ADMIN ADMINS - Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "super_admin") {
      return NextResponse.json(
        { error: "Non autorisé - Super Admin requis" },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID administrateur requis" },
        { status: 400 }
      );
    }

    const admins = getAdminAdmins();
    const adminIndex = admins.findIndex((admin) => admin.id === id);

    if (adminIndex === -1) {
      return NextResponse.json(
        { error: "Administrateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour les permissions si le rôle change
    if (updateData.role) {
      if (updateData.role === "super_admin") {
        updateData.permissions = allPermissions.map((p) => p.id);
      }
    }

    // Mettre à jour l'administrateur
    const updatedAdmin = { ...admins[adminIndex], ...updateData };
    admins[adminIndex] = updatedAdmin;
    saveAdminAdmins(admins);

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error("ADMIN ADMINS - Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUser | undefined;
    if (!sessionUser || sessionUser.role !== "super_admin") {
      return NextResponse.json(
        { error: "Non autorisé - Super Admin requis" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID administrateur requis" },
        { status: 400 }
      );
    }

    // Empêcher la suppression du dernier super admin
    const admins = getAdminAdmins();
    const adminToDelete = admins.find((admin) => admin.id === id);
    if (adminToDelete?.role === "super_admin") {
      const superAdminCount = admins.filter(
        (a) => a.role === "super_admin"
      ).length;
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Impossible de supprimer le dernier Super Admin" },
          { status: 400 }
        );
      }
    }

    const adminIndex = admins.findIndex((admin) => admin.id === id);

    if (adminIndex === -1) {
      return NextResponse.json(
        { error: "Administrateur non trouvé" },
        { status: 404 }
      );
    }

    admins.splice(adminIndex, 1);
    saveAdminAdmins(admins);

    return NextResponse.json({
      message: "Administrateur supprimé avec succès",
    });
  } catch (error) {
    console.error("ADMIN ADMINS - Erreur suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
