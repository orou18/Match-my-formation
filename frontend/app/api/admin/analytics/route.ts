import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data pour les analytics
const mockAnalytics = {
  overview: {
    totalUsers: 28743,
    totalCreators: 1234,
    totalRevenue: 156810,
    totalCourses: 892,
    engagementRate: 79.4,
    completionRate: 86.2,
    monthlyGrowth: {
      users: 12.5,
      creators: 8.3,
      revenue: 23.7,
      courses: -2.1,
      engagement: 5.2,
      completion: 3.8
    }
  },
  timeSeries: [
    { period: 'Jan', users: 4000, creators: 240, revenue: 24000, courses: 120, engagement: 78, completion: 85 },
    { period: 'Fév', users: 3000, creators: 139, revenue: 22100, courses: 95, engagement: 82, completion: 88 },
    { period: 'Mar', users: 2000, creators: 980, revenue: 22900, courses: 110, engagement: 75, completion: 82 },
    { period: 'Avr', users: 2780, creators: 390, revenue: 20000, courses: 105, engagement: 80, completion: 86 },
    { period: 'Mai', users: 1890, creators: 480, revenue: 21810, courses: 98, engagement: 77, completion: 84 },
    { period: 'Jun', users: 2390, creators: 380, revenue: 25000, courses: 125, engagement: 83, completion: 90 },
    { period: 'Jul', users: 3490, creators: 430, revenue: 21000, courses: 115, engagement: 79, completion: 87 },
  ],
  topPerformers: [
    { id: '1', name: 'Marketing Digital Avancé', type: 'course', metric: 'Revenus', value: 12500, change: 23.5 },
    { id: '2', name: 'Sophie Martin', type: 'creator', metric: 'Étudiants', value: 2847, change: 18.2 },
    { id: '3', name: 'Design UX/UI', type: 'course', metric: 'Completion', value: 94.5, change: 5.3 },
    { id: '4', name: 'Marc Bernard', type: 'creator', metric: 'Note', value: 4.8, change: 0.2 },
    { id: '5', name: 'Business Strategy', type: 'course', metric: 'Engagement', value: 89.2, change: 12.7 },
  ],
  categories: [
    { name: 'Marketing', value: 35, color: '#3B82F6' },
    { name: 'Business', value: 28, color: '#10B981' },
    { name: 'Design', value: 22, color: '#F59E0B' },
    { name: 'Technologie', value: 15, color: '#8B5CF6' },
  ],
  activityHeatmap: Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    activity: Math.floor(Math.random() * 100) + 20,
    users: Math.floor(Math.random() * 500) + 100
  }))
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const metric = searchParams.get('metric') || 'revenue';

    // Filtrer selon la période demandée
    let filteredTimeSeries = mockAnalytics.timeSeries;
    if (period === '7d') {
      filteredTimeSeries = mockAnalytics.timeSeries.slice(-7);
    } else if (period === '90d') {
      // Simuler 90 jours avec les dernières données
      filteredTimeSeries = Array.from({ length: 13 }, (_, i) => ({
        ...mockAnalytics.timeSeries[i % mockAnalytics.timeSeries.length],
        period: `Sem ${i + 1}`
      }));
    }

    console.log('ADMIN ANALYTICS - Données récupérées pour période:', period);
    
    return NextResponse.json({
      overview: mockAnalytics.overview,
      timeSeries: filteredTimeSeries,
      topPerformers: mockAnalytics.topPerformers,
      categories: mockAnalytics.categories,
      activityHeatmap: mockAnalytics.activityHeatmap,
      period: period,
      metric: metric
    });
  } catch (error) {
    console.error('ADMIN ANALYTICS - Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'export':
        // Simuler l'exportation des données
        console.log('ADMIN ANALYTICS - Export demandé:', data);
        return NextResponse.json({
          message: 'Export en cours',
          downloadUrl: '/api/admin/analytics/export?format=csv&period=' + (data.period || '30d')
        });
        
      case 'refresh':
        // Simuler le rafraîchissement des données
        console.log('ADMIN ANALYTICS - Rafraîchissement demandé');
        return NextResponse.json({
          message: 'Données rafraîchies',
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('ADMIN ANALYTICS - Erreur POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
