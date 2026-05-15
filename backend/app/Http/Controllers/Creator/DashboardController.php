<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePathway;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Statistiques générales
            $videoQuery = Video::where('uploader_id', $user->id);
            $totalVideos = (clone $videoQuery)->count();
            $totalViews = (clone $videoQuery)->sum('views');
            $totalLikes = (clone $videoQuery)->sum('likes');
            $totalComments = (clone $videoQuery)->sum('comments');
            $totalShares = (clone $videoQuery)->sum('shares');
            $totalRevenue = round($totalViews * 0.01, 2);

            // Vidéos récentes
            $recentVideos = (clone $videoQuery)
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'views', 'likes', 'comments', 'shares', 'created_at']);

            // Données de performance réelles (30 derniers jours)
            $performanceData = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $dayVideos = Video::where('uploader_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->get(['views', 'likes', 'comments']);

                $dayViews = $dayVideos->sum('views');
                $dayLikes = $dayVideos->sum('likes');
                $dayComments = $dayVideos->sum('comments');
                $dayRevenue = round($dayViews * 0.01, 2);

                $performanceData[] = [
                    'date' => $date,
                    'views' => $dayViews,
                    'likes' => $dayLikes,
                    'comments' => $dayComments,
                    'revenue' => $dayRevenue,
                    'videos_created' => $dayVideos->count(),
                ];
            }

            // Analytics avancées
            $monthlyGrowth = $this->calculateMonthlyGrowth($user->id);
            $engagementRate = $this->calculateEngagementRate($user->id);
            $avgWatchTime = $this->calculateAverageWatchTime($user->id);

            return response()->json([
                'overview' => [
                    'totalVideos' => $totalVideos,
                    'totalViews' => $totalViews,
                    'totalLikes' => $totalLikes,
                    'totalComments' => $totalComments,
                    'totalShares' => $totalShares,
                    'totalRevenue' => $totalRevenue,
                    'totalSubscribers' => Employee::where('creator_id', $user->id)->count(),
                    'avgWatchTime' => $avgWatchTime,
                    'activeAssignments' => EmployeePathway::where('creator_id', $user->id)->where('is_active', true)->count(),
                    'monthlyGrowth' => $monthlyGrowth,
                    'engagementRate' => $engagementRate,
                ],
                'recentVideos' => $recentVideos,
                'performanceData' => $performanceData,
                'topVideos' => $recentVideos->take(3)->map(function($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'comments' => $video->comments,
                        'shares' => $video->shares,
                        'revenue' => round($video->views * 0.01, 2),
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculer la croissance mensuelle
     */
    private function calculateMonthlyGrowth($userId): array
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        
        $currentMonthViews = Video::where('uploader_id', $userId)
            ->where('created_at', '>=', $currentMonth)
            ->sum('views');
            
        $lastMonthViews = Video::where('uploader_id', $userId)
            ->where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->sum('views');

        $growthRate = $lastMonthViews > 0 
            ? (($currentMonthViews - $lastMonthViews) / $lastMonthViews) * 100 
            : 0;

        return [
            'views' => round($growthRate, 2),
            'revenue' => round($growthRate * 0.01, 2),
            'videos' => $this->calculateVideosGrowth($userId),
            'subscribers' => $this->calculateSubscribersGrowth($userId),
        ];
    }

    /**
     * Calculer le taux d'engagement
     */
    private function calculateEngagementRate($userId): float
    {
        $totalVideos = Video::where('uploader_id', $userId)->count();
        if ($totalVideos === 0) return 0;

        $totalInteractions = Video::where('uploader_id', $userId)
            ->sum('views') + Video::where('uploader_id', $userId)->sum('likes') + Video::where('uploader_id', $userId)->sum('comments');

        return round(($totalInteractions / ($totalVideos * 1000)) * 100, 2); // Basé sur 1000 vues par vidéo
    }

    /**
     * Calculer le temps moyen de visionnage
     */
    private function calculateAverageWatchTime($userId): float
    {
        $totalDuration = Video::where('uploader_id', $userId)
            ->sum('duration_seconds');
        
        $totalVideos = Video::where('uploader_id', $userId)->count();
        
        return $totalVideos > 0 ? round($totalDuration / $totalVideos / 60, 2) : 0; // En minutes
    }

    /**
     * Calculer la croissance des vidéos
     */
    private function calculateVideosGrowth($userId): float
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        
        $currentMonthCount = Video::where('uploader_id', $userId)
            ->where('created_at', '>=', $currentMonth)
            ->count();
            
        $lastMonthCount = Video::where('uploader_id', $userId)
            ->where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->count();

        return $lastMonthCount > 0 
            ? round((($currentMonthCount - $lastMonthCount) / $lastMonthCount) * 100, 2)
            : 0;
    }

    /**
     * Calculer la croissance des abonnés
     */
    private function calculateSubscribersGrowth($userId): float
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        
        $currentMonthCount = Employee::where('creator_id', $userId)
            ->where('created_at', '>=', $currentMonth)
            ->count();
            
        $lastMonthCount = Employee::where('creator_id', $userId)
            ->where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->count();

        return $lastMonthCount > 0 
            ? round((($currentMonthCount - $lastMonthCount) / $lastMonthCount) * 100, 2)
            : 0;
    }
}
