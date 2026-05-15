<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreatorRevenueController extends Controller
{
    /**
     * Obtenir les statistiques de revenus du créateur
     */
    public function getRevenue(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $timeRange = $request->get('timeRange', '30d');
            
            // Calculer la date de début selon le timeRange
            $startDate = match($timeRange) {
                '7d' => now()->subDays(7),
                '30d' => now()->subDays(30),
                '90d' => now()->subDays(90),
                '1y' => now()->subYear(),
                default => now()->subDays(30),
            };

            // Calculer les revenus depuis les vidéos (1 centime par vue)
            $videos = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->get();

            $totalViews = $videos->sum('views');
            $totalRevenue = $totalViews * 0.01; // 1 centime par vue

            // Calculer le revenu mensuel
            $monthlyRevenue = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', now()->subMonth())
                ->sum('views') * 0.01;

            // Calculer la croissance
            $previousPeriodRevenue = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate->copy()->subDays($startDate->diffInDays(now())))
                ->where('created_at', '<', $startDate)
                ->sum('views') * 0.01;

            $growth = $previousPeriodRevenue > 0 
                ? (($totalRevenue - $previousPeriodRevenue) / $previousPeriodRevenue) * 100 
                : 0;

            // Calculer le nombre total de commandes (inscriptions)
            $totalOrders = Employee::where('creator_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->count();

            // Calculer la valeur moyenne par commande
            $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

            // Calculer le taux de conversion (employés actifs / total employés)
            $totalEmployees = Employee::where('creator_id', $user->id)->count();
            $activeEmployees = Employee::where('creator_id', $user->id)
                ->whereHas('progress', function($query) use ($startDate) {
                    $query->where('last_watched_at', '>=', $startDate);
                })
                ->count();
            
            $conversionRate = $totalEmployees > 0 ? ($activeEmployees / $totalEmployees) * 100 : 0;

            // Top produits (vidéos les plus vues)
            $topProducts = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->orderBy('views', 'desc')
                ->limit(4)
                ->get(['title', 'views'])
                ->map(function($video) {
                    return [
                        'name' => $video->title,
                        'revenue' => $video->views * 0.01,
                        'orders' => $video->views, // Chaque vue = une commande potentielle
                    ];
                });

            // Données mensuelles pour le graphique
            $monthlyData = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', now()->subMonths(6))
                ->selectRaw('DATE_FORMAT(created_at, "%b") as month, SUM(views) as views')
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(function($data) {
                    return [
                        'month' => $data->month,
                        'revenue' => $data->views * 0.01,
                        'orders' => $data->views,
                    ];
                });

            // S'assurer que tous les mois sont présents
            $allMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
            $completeMonthlyData = [];
            
            foreach ($allMonths as $month) {
                $monthData = $monthlyData->firstWhere('month', $month);
                $completeMonthlyData[] = [
                    'month' => $month,
                    'revenue' => $monthData ? $monthData['revenue'] : 0,
                    'orders' => $monthData ? $monthData['orders'] : 0,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'totalRevenue' => round($totalRevenue, 2),
                    'monthlyRevenue' => round($monthlyRevenue, 2),
                    'growth' => round($growth, 1),
                    'averageOrderValue' => round($averageOrderValue, 2),
                    'totalOrders' => $totalOrders,
                    'conversionRate' => round($conversionRate, 1),
                    'topProducts' => $topProducts->toArray(),
                    'monthlyData' => $completeMonthlyData,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les détails des revenus par période
     */
    public function getRevenueDetails(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $startDate = $request->get('start_date', now()->subMonth());
            $endDate = $request->get('end_date', now());

            // Revenus par vidéo
            $revenueByVideo = Video::where('uploader_id', $user->id)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->select('title', 'views', 'created_at')
                ->get()
                ->map(function($video) {
                    return [
                        'title' => $video->title,
                        'revenue' => $video->views * 0.01,
                        'views' => $video->views,
                        'created_at' => $video->created_at->format('Y-m-d'),
                    ];
                });

            // Revenus par jour
            $revenueByDay = Video::where('uploader_id', $user->id)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(views) * 0.01 as revenue, COUNT(*) as videos')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'revenueByVideo' => $revenueByVideo->toArray(),
                    'revenueByDay' => $revenueByDay->toArray(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
