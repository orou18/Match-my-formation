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

            // Données de performance (7 derniers jours)
            $performanceData = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $dayVideos = Video::where('uploader_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->get(['views', 'likes', 'comments']);

                $performanceData[] = [
                    'date' => $date,
                    'views' => $dayVideos->sum('views'),
                    'likes' => $dayVideos->sum('likes'),
                    'comments' => $dayVideos->sum('comments'),
                    'revenue' => round($dayVideos->sum('views') * 0.01, 2),
                ];
            }

            return response()->json([
                'overview' => [
                    'totalVideos' => $totalVideos,
                    'totalViews' => $totalViews,
                    'totalLikes' => $totalLikes,
                    'totalComments' => $totalComments,
                    'totalShares' => $totalShares,
                    'totalRevenue' => $totalRevenue,
                    'totalSubscribers' => Employee::where('creator_id', $user->id)->count(),
                    'avgWatchTime' => 0,
                    'activeAssignments' => EmployeePathway::where('creator_id', $user->id)->where('is_active', true)->count(),
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
