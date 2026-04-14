import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await laravelFetch("/api/creator/notifications", {
      request,
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(
      Array.isArray(data) ? { notifications: data } : data,
      { status: response.status }
    );
  } catch (error) {
    console.error(
      "Erreur lors du chargement des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "mark_all_read") {
      const response = await laravelFetch(
        "/api/creator/notifications/read-all",
        {
          request,
          method: "POST",
        }
      );
      const data = await parseLaravelJson(response);
      return NextResponse.json(data, { status: response.status });
    }

    if (!body.id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const response = await laravelFetch(
      `/api/creator/notifications/${body.id}/read`,
      {
        request,
        method: "POST",
      }
    );
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const listResponse = await laravelFetch("/api/creator/notifications", {
        request,
      });
      const listData = await parseLaravelJson(listResponse);
      const notifications = Array.isArray(listData)
        ? listData
        : listData?.notifications || [];
      await Promise.all(
        notifications.map((notification: { id: string | number }) =>
          laravelFetch(`/api/creator/notifications/${notification.id}`, {
            request,
            method: "DELETE",
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    const response = await laravelFetch(`/api/creator/notifications/${id}`, {
      request,
      method: "DELETE",
    });
    const data = await parseLaravelJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des notifications créateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
