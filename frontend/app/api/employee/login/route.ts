import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/api/backend-fetch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchBackend("/api/employee/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        login_id: body.login_id,
        password: body.password,
      }),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Employee login proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la connexion employe",
      },
      { status: 500 }
    );
  }
}
