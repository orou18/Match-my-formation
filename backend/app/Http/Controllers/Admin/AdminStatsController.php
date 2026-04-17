<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Enrollment;
use App\Models\VideoLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    /**
     * Vérifier que l'utilisateur est admin
     */
    private function ensureAdmin(): void
    {
        $user = auth()->user();
        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
    }

    /**
     * Obtenir les statistiques complètes du dashboard
     */
    public function getStats(Request $request): \Illuminate\Http\JsonResponse
    {
        $this->ensureAdmin();

        $period = $request->input('period', '30d');
        $metric = $request->input('metric', 'overview');

        // Calculer les dates selon la période
        $dates = $this->getDateRange($period);
        $startDate = $dates['start'];
        $endDate = $dates['end'];

        // Statistiques de base
        $stats = [
            'overview' => [
                'totalUsers' => User::count(),
                'totalCreators' => User::where('role', 'creator')->count(),
                'totalVideos' => Video::count(),
                'totalCourses' => Video::where('is_published', true)->count(),
                'totalRevenue' => $this->calculateRevenue($startDate, $endDate),
                'engagementRate' => $this->calculateEngagementRate(),
            ],
            'monthlyGrowth' => [
                'users' => $this->calculateUserGrowth($startDate, $endDate),
                'creators' => $this->calculateCreatorGrowth($startDate, $endDate),
                'revenue' => $this->calculateRevenueGrowth($startDate, $endDate),
                'courses' => $this->calculateCourseGrowth($startDate, $endDate),
                'engagement' => $this->calculateEngagementGrowth($startDate, $endDate),
            ],
            'recentActivity' => $this->getRecentActivity(),
            'charts' => [
                'userGrowth' => $this->getUserGrowthChart($startDate, $endDate),
                'revenueChart' => $this->getRevenueChart($startDate, $endDate),
                'videoStats' => $this->getVideoStats(),
                'categoryDistribution' => $this->getCategoryDistribution(),
            ]
        ];

        return response()->json($stats);
    }

    /**
     * Obtenir la plage de dates selon la période
     */
    private function getDateRange(string $period): array
    {
        $now = now();
        
        switch ($period) {
            case '7d':
                return [
                    'start' => $now->copy()->subDays(7),
                    'end' => $now
                ];
            case '30d':
                return [
                    'start' => $now->copy()->subDays(30),
                    'end' => $now
                ];
            case '90d':
                return [
                    'start' => $now->copy()->subDays(90),
                    'end' => $now
                ];
            case '1y':
                return [
                    'start' => $now->copy()->subYear(),
                    'end' => $now
                ];
            default:
                return [
                    'start' => $now->copy()->subDays(30),
                    'end' => $now
                ];
        }
    }

    /**
     * Calculer les revenus (simulation basée sur les abonnements)
     */
    private function calculateRevenue($startDate, $endDate): float
    {
        // Simulation : compter les utilisateurs actifs et multiplier par un prix moyen
        $activeUsers = User::whereNotNull('email_verified_at')
                           ->where('created_at', '>=', $startDate)
                           ->where('created_at', '<=', $endDate)
                           ->count();

        // Prix moyen par abonnement (simulation)
        $averagePrice = 29.99; // EUR
        
        return $activeUsers * $averagePrice;
    }

    /**
     * Calculer le taux d'engagement
     */
    private function calculateEngagementRate(): float
    {
        $totalUsers = User::whereNotNull('email_verified_at')->count();
        
        if ($totalUsers === 0) return 0;

        // Compter les utilisateurs avec au moins une interaction
        $engagedUsers = DB::table('video_likes')
                           ->distinct('user_id')
                           ->count();

        return round(($engagedUsers / $totalUsers) * 100, 2);
    }

    /**
     * Calculer la croissance des utilisateurs
     */
    private function calculateUserGrowth($startDate, $endDate): float
    {
        $currentPeriod = User::whereBetween('created_at', [$startDate, $endDate])->count();
        $previousPeriod = User::whereBetween('created_at', [
            $startDate->copy()->subDays($endDate->diffInDays($startDate)),
            $startDate
        ])->count();

        if ($previousPeriod === 0) return $currentPeriod > 0 ? 100 : 0;

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 2);
    }

    /**
     * Calculer la croissance des créateurs
     */
    private function calculateCreatorGrowth($startDate, $endDate): float
    {
        $currentPeriod = User::where('role', 'creator')
                           ->whereBetween('created_at', [$startDate, $endDate])
                           ->count();
        $previousPeriod = User::where('role', 'creator')
                           ->whereBetween('created_at', [
                               $startDate->copy()->subDays($endDate->diffInDays($startDate)),
                               $startDate
                           ])
                           ->count();

        if ($previousPeriod === 0) return $currentPeriod > 0 ? 100 : 0;

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 2);
    }

    /**
     * Calculer la croissance des revenus
     */
    private function calculateRevenueGrowth($startDate, $endDate): float
    {
        $currentRevenue = $this->calculateRevenue($startDate, $endDate);
        $previousRevenue = $this->calculateRevenue(
            $startDate->copy()->subDays($endDate->diffInDays($startDate)),
            $startDate
        );

        if ($previousRevenue === 0) return $currentRevenue > 0 ? 100 : 0;

        return round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 2);
    }

    /**
     * Calculer la croissance des cours
     */
    private function calculateCourseGrowth($startDate, $endDate): float
    {
        $currentPeriod = Video::where('is_published', true)
                           ->whereBetween('created_at', [$startDate, $endDate])
                           ->count();
        $previousPeriod = Video::where('is_published', true)
                           ->whereBetween('created_at', [
                               $startDate->copy()->subDays($endDate->diffInDays($startDate)),
                               $startDate
                           ])
                           ->count();

        if ($previousPeriod === 0) return $currentPeriod > 0 ? 100 : 0;

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 2);
    }

    /**
     * Calculer la croissance de l'engagement
     */
    private function calculateEngagementGrowth($startDate, $endDate): float
    {
        // Simulation : basée sur l'augmentation des likes
        $currentLikes = VideoLike::whereBetween('created_at', [$startDate, $endDate])->count();
        $previousLikes = VideoLike::whereBetween('created_at', [
            $startDate->copy()->subDays($endDate->diffInDays($startDate)),
            $startDate
        ])->count();

        if ($previousLikes === 0) return $currentLikes > 0 ? 100 : 0;

        return round((($currentLikes - $previousLikes) / $previousLikes) * 100, 2);
    }

    /**
     * Obtenir l'activité récente
     */
    private function getRecentActivity(): array
    {
        $activities = [];

        // Récupérer les derniers utilisateurs inscrits
        $recentUsers = User::orderBy('created_at', 'desc')
                           ->take(5)
                           ->get(['id', 'name', 'created_at']);

        foreach ($recentUsers as $user) {
            $activities[] = [
                'id' => 'user_' . $user->id,
                'user' => $user->name,
                'action' => 'a rejoint la plateforme',
                'date' => $user->created_at->diffForHumans(),
                'type' => 'user',
                'icon' => 'user-plus'
            ];
        }

        // Récupérer les dernières vidéos publiées
        $recentVideos = Video::where('is_published', true)
                            ->orderBy('created_at', 'desc')
                            ->take(3)
                            ->with('creator')
                            ->get();

        foreach ($recentVideos as $video) {
            $activities[] = [
                'id' => 'video_' . $video->id,
                'user' => $video->creator->name ?? 'Admin',
                'action' => 'a publié une nouvelle vidéo: ' . $video->title,
                'date' => $video->created_at->diffForHumans(),
                'type' => 'video',
                'icon' => 'video'
            ];
        }

        // Trier par date
        usort($activities, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return array_slice($activities, 0, 10);
    }

    /**
     * Obtenir les données pour le graphique de croissance des utilisateurs
     */
    private function getUserGrowthChart($startDate, $endDate): array
    {
        $growth = [];
        $current = $startDate->copy();

        while ($current <= $endDate) {
            $dayStart = $current->copy()->startOfDay();
            $dayEnd = $current->copy()->endOfDay();

            $users = User::whereBetween('created_at', [$dayStart, $dayEnd])->count();

            $growth[] = [
                'date' => $current->format('Y-m-d'),
                'users' => $users
            ];

            $current->addDay();
        }

        return $growth;
    }

    /**
     * Obtenir les données pour le graphique des revenus
     */
    private function getRevenueChart($startDate, $endDate): array
    {
        $revenue = [];
        $current = $startDate->copy();

        while ($current <= $endDate) {
            $dayStart = $current->copy()->startOfDay();
            $dayEnd = $current->copy()->endOfDay();

            $newUsers = User::whereBetween('created_at', [$dayStart, $dayEnd])->count();
            $dayRevenue = $newUsers * 29.99; // Prix moyen

            $revenue[] = [
                'date' => $current->format('Y-m-d'),
                'revenue' => $dayRevenue
            ];

            $current->addDay();
        }

        return $revenue;
    }

    /**
     * Obtenir les statistiques des vidéos
     */
    private function getVideoStats(): array
    {
        return [
            'total' => Video::count(),
            'published' => Video::where('is_published', true)->count(),
            'draft' => Video::where('is_published', false)->count(),
            'totalViews' => Video::sum('views') ?? 0,
            'totalLikes' => Video::withCount('likes')->get()->sum('likes_count'),
            'averageViews' => Video::avg('views') ?? 0,
        ];
    }

    /**
     * Obtenir la distribution par catégorie
     */
    private function getCategoryDistribution(): array
    {
        return Video::selectRaw('category, COUNT(*) as count')
                   ->groupBy('category')
                   ->orderByDesc('count')
                   ->get()
                   ->map(function ($item) {
                       return [
                           'category' => $item->category,
                           'count' => $item->count,
                           'percentage' => round(($item->count / Video::count()) * 100, 2)
                       ];
                   })
                   ->toArray();
    }
}
