import { NextResponse } from "next/server";

const message =
  "Les actions batch de bibliothèque ne sont pas disponibles sans endpoint Laravel persistant.";

export async function POST() {
  return NextResponse.json({ success: false, message }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ success: false, message }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, message }, { status: 405 });
}
