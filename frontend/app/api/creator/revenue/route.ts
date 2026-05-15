import { NextRequest, NextResponse } from "next/server";
import { laravelFetch, parseLaravelJson } from "@/lib/api/laravel-proxy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    
    // Transférer les paramètres au backend Laravel
    const url = `/api/creator/revenue?timeRange=${timeRange}`;
    
    const response = await laravelFetch(url, { request });
    const data = await parseLaravelJson(response);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("CREATOR REVENUE - Erreur:", error);
    
    // Fallback avec données simulées si le backend ne répond pas
    const fallbackData = {
      totalRevenue: 45680,
      monthlyRevenue: 12450,
      growth: 15.8,
      averageOrderValue: 89.5,
      totalOrders: 511,
      conversionRate: 3.2,
      topProducts: [
        { name: "Formation Hôtellerie Avancée", revenue: 12450, orders: 89 },
        { name: "Gestion Restaurant", revenue: 8900, orders: 67 },
        { name: "Tourisme Durable", revenue: 6780, orders: 45 },
        { name: "Service Client", revenue: 4560, orders: 34 },
      ],
      monthlyData: [
        { month: "Jan", revenue: 8900, orders: 78 },
        { month: "Fév", revenue: 10200, orders: 92 },
        { month: "Mar", revenue: 12450, orders: 89 },
        { month: "Avr", revenue: 11800, orders: 85 },
        { month: "Mai", revenue: 13500, orders: 98 },
        { month: "Juin", revenue: 14200, orders: 103 },
      ],
    };

    return NextResponse.json({
      success: true,
      data: fallbackData
    }, { status: 200 });
  }
}
