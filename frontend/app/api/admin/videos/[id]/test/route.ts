import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("Test API called with ID:", id);
    
    return NextResponse.json({
      success: true,
      message: "Test API working",
      id: id
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Test API error" 
      },
      { status: 500 }
    );
  }
}
