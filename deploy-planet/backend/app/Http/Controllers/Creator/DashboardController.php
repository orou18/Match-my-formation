<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Temporairement désactivé pour test
            // $user = Auth::user();
            
            // if (!$user) {
            //     return response()->json(['error' => 'Unauthorized'], 401);
            // }

            $user = (object) ['id' => 4]; // Simulation

            // Statistiques générales
            $totalVideos = Video::where('uploader_id', $user->id)->count();
            $totalViews = Video::where('uploader_id', $user->id)->sum('views');
            $totalLikes = Video::where('uploader_id', $user->id)->sum('likes');
            $totalComments = Video::where('uploader_id', $user->id)->sum('comments');
            $totalShares = Video::where('uploader_id', $user->id)->sum('shares');
            $totalRevenue = $totalViews * 0.01; // Exemple: 0.01€ par vue
            
            // Vidéos récentes
            $recentVideos = Video::where('uploader_id', $user->id)
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'views', 'likes', 'created_at']);

            // Données de performance (7 derniers jours)
            $performanceData = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $views = Video::where('uploader_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->sum('views');
                
                $performanceData[] = [
                    'date' => $date,
                    'views' => $views,
                    'likes' => rand(10, 100), // Données simulées
                    'revenue' => $views * 0.01
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
                    'totalSubscribers' => rand(100, 1000), // Données simulées
                    'avgWatchTime' => rand(180, 600), // en secondes
                ],
                'recentVideos' => $recentVideos,
                'performanceData' => $performanceData,
                'topVideos' => $recentVideos->take(3)->map(function($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'revenue' => $video->views * 0.01
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
