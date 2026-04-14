import { NextRequest, NextResponse } from "next/server";

// Proxy server-side vers le backend Laravel pour l'inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to backend API (assumes backend accessible sur 127.0.0.1:8000)
    const backendRes = await fetch("http://127.0.0.1:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();
    const status = backendRes.status;

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      json = { message: text };
    }

    return NextResponse.json(json ?? {}, { status });
  } catch (error) {
    console.error("register proxy error", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
