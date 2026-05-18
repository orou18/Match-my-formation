<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreatorEngagementController extends Controller
{
    /**
     * Obtenir les statistiques d'engagement du créateur
     */
    public function getEngagement(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $period = $request->get('period', 'week');
            
            // Calculer la date de début selon la période
            $startDate = match($period) {
                'day' => now()->subDay(),
                'week' => now()->subWeek(),
                'month' => now()->subMonth(),
                'year' => now()->subYear(),
                default => now()->subWeek(),
            };

            // Statistiques des vidéos du créateur
            $videos = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->get();

            $totalViews = $videos->sum('views');
            $totalLikes = $videos->sum('likes');
            $totalComments = $videos->sum('comments');
            $totalShares = $videos->sum('shares') ?? 0; // Si le champ n'existe pas

            // Calculer le taux d'engagement global
            $engagementRate = $totalViews > 0 
                ? (($totalLikes + $totalComments + $totalShares) / $totalViews) * 100 
                : 0;

            // Top vidéos par engagement
            $topVideos = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->get()
                ->map(function($video) {
                    $videoEngagement = $video->views > 0 
                        ? (($video->likes + $video->comments + ($video->shares ?? 0)) / $video->views) * 100 
                        : 0;
                    
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'thumbnail' => $video->thumbnail ?? '/placeholder.jpg',
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'comments' => $video->comments,
                        'shares' => $video->shares ?? 0,
                        'engagement' => round($videoEngagement, 2),
                        'duration' => $this->formatDuration($video->duration ?? 0),
                    ];
                })
                ->sortByDesc('engagement')
                ->take(10)
                ->values();

            // Timeline d'engagement par jour
            $engagementTimeline = Video::where('uploader_id', $user->id)
                ->where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, SUM(views) as views, SUM(likes) as likes, SUM(comments) as comments, SUM(COALESCE(shares, 0)) as shares')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function($data) {
                    $dailyEngagement = $data->views > 0 
                        ? (($data->likes + $data->comments + $data->shares) / $data->views) * 100 
                        : 0;
                    
                    return [
                        'date' => $data->date,
                        'likes' => $data->likes,
                        'comments' => $data->comments,
                        'shares' => $data->shares,
                        'engagement' => round($dailyEngagement, 2),
                    ];
                });

            // Segments d'audience (basés sur la progression des employés)
            $audienceSegments = $this->calculateAudienceSegments($user->id);

            $recentComments = $this->getRecentComments($user->id, $startDate);

            // Métriques d'engagement
            $engagementMetrics = [
                [
                    'metric' => 'Vues totales',
                    'value' => number_format($totalViews),
                    'change' => $this->calculateGrowth($user->id, 'views', $startDate),
                    'color' => 'text-blue-600',
                    'icon' => 'Eye',
                ],
                [
                    'metric' => 'Likes',
                    'value' => number_format($totalLikes),
                    'change' => $this->calculateGrowth($user->id, 'likes', $startDate),
                    'color' => 'text-red-600',
                    'icon' => 'Heart',
                ],
                [
                    'metric' => 'Commentaires',
                    'value' => number_format($totalComments),
                    'change' => $this->calculateGrowth($user->id, 'comments', $startDate),
                    'color' => 'text-green-600',
                    'icon' => 'MessageSquare',
                ],
                [
                    'metric' => 'Partages',
                    'value' => number_format($totalShares),
                    'change' => $this->calculateGrowth($user->id, 'shares', $startDate),
                    'color' => 'text-purple-600',
                    'icon' => 'Share',
                ],
                [
                    'metric' => 'Taux d\'engagement',
                    'value' => round($engagementRate, 1) . '%',
                    'change' => $this->calculateEngagementGrowth($user->id, $startDate),
                    'color' => 'text-orange-600',
                    'icon' => 'TrendingUp',
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'engagementMetrics' => $engagementMetrics,
                    'topVideos' => $topVideos->toArray(),
                    'engagementTimeline' => $engagementTimeline->toArray(),
                    'audienceSegments' => $audienceSegments,
                    'recentComments' => $recentComments,
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
     * Calculer les segments d'audience
     */
    private function calculateAudienceSegments($creatorId)
    {
        $totalEmployees = Employee::where('creator_id', $creatorId)->count();
        
        if ($totalEmployees === 0) {
            return [
                ['segment' => 'Nouveaux', 'percentage' => 0, 'engagement' => 0, 'color' => '#3B82F6'],
                ['segment' => 'Actifs', 'percentage' => 0, 'engagement' => 0, 'color' => '#10B981'],
                ['segment' => 'Engagés', 'percentage' => 0, 'engagement' => 0, 'color' => '#F59E0B'],
                ['segment' => 'Inactifs', 'percentage' => 100, 'engagement' => 0, 'color' => '#6B7280'],
            ];
        }

        // Nouveaux : inscrits depuis moins de 30 jours
        $newEmployees = Employee::where('creator_id', $creatorId)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // Actifs : ont regardé une vidéo depuis 7 jours
        $activeEmployees = Employee::where('creator_id', $creatorId)
            ->whereHas('progress', function($query) {
                $query->where('last_watched_at', '>=', now()->subDays(7));
            })
            ->count();

        // Engagés : plus de 50% de progression moyenne
        $engagedEmployees = Employee::where('creator_id', $creatorId)
            ->whereHas('progress', function($query) {
                $query->where('progress_percentage', '>', 50);
            })
            ->count();

        // Inactifs : le reste
        $inactiveEmployees = $totalEmployees - $activeEmployees;

        return [
            [
                'segment' => 'Nouveaux',
                'percentage' => round(($newEmployees / $totalEmployees) * 100, 1),
                'engagement' => 75,
                'color' => '#3B82F6',
            ],
            [
                'segment' => 'Actifs',
                'percentage' => round(($activeEmployees / $totalEmployees) * 100, 1),
                'engagement' => 85,
                'color' => '#10B981',
            ],
            [
                'segment' => 'Engagés',
                'percentage' => round(($engagedEmployees / $totalEmployees) * 100, 1),
                'engagement' => 95,
                'color' => '#F59E0B',
            ],
            [
                'segment' => 'Inactifs',
                'percentage' => round(($inactiveEmployees / $totalEmployees) * 100, 1),
                'engagement' => 25,
                'color' => '#6B7280',
            ],
        ];
    }

    /**
     * Obtenir les commentaires récents depuis la table chat_messages.
     */
    private function getRecentComments($creatorId, $startDate)
    {
        return ChatMessage::with(['user:id,name,avatar', 'video:id,title,thumbnail,uploader_id'])
            ->whereHas('video', fn ($query) => $query->where('uploader_id', $creatorId))
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (ChatMessage $message) => [
                'id' => (string) $message->id,
                'user' => [
                    'name' => $message->user?->name ?? 'Utilisateur',
                    'avatar' => $message->user?->avatar,
                ],
                'content' => $message->message,
                'video' => [
                    'title' => $message->video?->title,
                    'thumbnail' => $message->video?->thumbnail_url,
                    'id' => (string) $message->video_id,
                ],
                'timestamp' => $message->created_at?->toISOString(),
                'likes' => (int) $message->likes_count,
                'replies' => $message->replies()->count(),
                'status' => $message->status,
                'sentiment' => 'neutral',
                'isPinned' => false,
            ])
            ->values()
            ->all();
    }

    /**
     * Calculer la croissance pour une métrique
     */
    private function calculateGrowth($creatorId, $metric, $startDate)
    {
        $currentPeriod = Video::where('uploader_id', $creatorId)
            ->where('created_at', '>=', $startDate)
            ->sum($metric);

        $previousPeriod = Video::where('uploader_id', $creatorId)
            ->where('created_at', '>=', $startDate->copy()->subDays($startDate->diffInDays(now())))
            ->where('created_at', '<', $startDate)
            ->sum($metric);

        if ($previousPeriod === 0) {
            return $currentPeriod > 0 ? 100 : 0;
        }

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 1);
    }

    /**
     * Calculer la croissance du taux d'engagement
     */
    private function calculateEngagementGrowth($creatorId, $startDate)
    {
        $currentPeriod = $this->calculateEngagementRate($creatorId, $startDate);
        $previousPeriod = $this->calculateEngagementRate($creatorId, 
            $startDate->copy()->subDays($startDate->diffInDays(now())), 
            $startDate
        );

        if ($previousPeriod === 0) {
            return $currentPeriod > 0 ? 100 : 0;
        }

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 1);
    }

    /**
     * Calculer le taux d'engagement pour une période
     */
    private function calculateEngagementRate($creatorId, $startDate, $endDate = null)
    {
        $query = Video::where('uploader_id', $creatorId)
            ->where('created_at', '>=', $startDate);

        if ($endDate) {
            $query->where('created_at', '<', $endDate);
        }

        $videos = $query->get();
        
        $totalViews = $videos->sum('views');
        $totalInteractions = $videos->sum('likes') + $videos->sum('comments') + $videos->sum('shares') ?? 0;

        return $totalViews > 0 ? ($totalInteractions / $totalViews) * 100 : 0;
    }

    /**
     * Formater la durée
     */
    private function formatDuration($seconds)
    {
        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;
        return sprintf('%02d:%02d', $minutes, $seconds);
    }
}
