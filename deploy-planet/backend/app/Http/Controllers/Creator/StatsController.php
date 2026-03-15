<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $range = $request->get('range', '7d');
            $days = $range === '7d' ? 7 : ($range === '30d' ? 30 : ($range === '90d' ? 90 : 365));

            // Statistiques générales
            $totalViews = Video::where('uploader_id', $user->id)->sum('views');
            $totalLikes = Video::where('uploader_id', $user->id)->sum('likes');
            $totalComments = Video::where('uploader_id', $user->id)->sum('comments');
            $totalShares = Video::where('uploader_id', $user->id)->sum('shares');
            $totalRevenue = $totalViews * 0.01; // 0.01€ par vue
            $totalSubscribers = rand(100, 1000); // Simulé
            $avgWatchTime = rand(180, 600); // en secondes

            // Données de performance
            $views = [];
            $likes = [];
            $revenue = [];
            $dates = [];

            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $dayViews = Video::where('uploader_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->sum('views');
                
                $views[] = $dayViews;
                $likes[] = rand(10, 100);
                $revenue[] = $dayViews * 0.01;
                $dates[] = $date;
            }

            // Top vidéos
            $topVideos = Video::where('uploader_id', $user->id)
                ->orderBy('views', 'desc')
                ->limit(5)
                ->get(['id', 'title', 'views', 'likes'])
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'revenue' => $video->views * 0.01
                    ];
                });

            // Démographie (données simulées)
            $demographics = [
                'countries' => [
                    ['name' => 'France', 'value' => 45],
                    ['name' => 'Belgique', 'value' => 20],
                    ['name' => 'Suisse', 'value' => 15],
                    ['name' => 'Canada', 'value' => 10],
                    ['name' => 'Maroc', 'value' => 10],
                ],
                'ageGroups' => [
                    ['range' => '18-24', 'value' => 25],
                    ['range' => '25-34', 'value' => 35],
                    ['range' => '35-44', 'value' => 20],
                    ['range' => '45-54', 'value' => 15],
                    ['range' => '55+', 'value' => 5],
                ],
                'devices' => [
                    ['type' => 'Desktop', 'value' => 45],
                    ['type' => 'Mobile', 'value' => 40],
                    ['type' => 'Tablet', 'value' => 15],
                ],
            ];

            return response()->json([
                'overview' => [
                    'totalViews' => $totalViews,
                    'totalLikes' => $totalLikes,
                    'totalComments' => $totalComments,
                    'totalShares' => $totalShares,
                    'totalRevenue' => $totalRevenue,
                    'totalSubscribers' => $totalSubscribers,
                    'avgWatchTime' => $avgWatchTime,
                ],
                'performance' => [
                    'views' => $views,
                    'likes' => $likes,
                    'revenue' => $revenue,
                    'dates' => $dates,
                ],
                'topVideos' => $topVideos,
                'demographics' => $demographics,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
