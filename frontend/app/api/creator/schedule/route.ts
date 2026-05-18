import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    items: [],
    message: "Aucune table de planning persistante n'est encore définie côté Laravel.",
  });
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Planning non modifiable sans endpoint Laravel persistant." },
    { status: 405 }
  );
}
