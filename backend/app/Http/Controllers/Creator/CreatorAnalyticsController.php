<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employee;
use App\Models\Video;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreatorAnalyticsController extends Controller
{
    /**
     * Récupère les analytics des employés pour un créateur
     */
    public function getEmployeeAnalytics(Request $request): JsonResponse
    {
        try {
            $creator = auth()->user();
            
            if (!$creator) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié'
                ], 401);
            }

            // Paramètres de filtrage
            $department = $request->get('department', 'all');
            $dateRange = $request->get('date_range', '30d');
            $sortBy = $request->get('sort_by', 'progress');
            $page = intval($request->get('page', 1));
            $limit = intval($request->get('limit', 10));

            // Calculer la date de début selon le range
            $startDate = $this->calculateStartDate($dateRange);

            // Récupérer les employés avec leurs progressions
            $query = Employee::with(['progress' => function($query) use ($creator, $startDate) {
                $query->where('creator_id', $creator->id)
                      ->where('updated_at', '>=', $startDate);
            }]);

            // Filtrer par département si nécessaire
            if ($department !== 'all') {
                $query->where('department', $department);
            }

            // Cloner pour le comptage total
            $totalQuery = clone $query;
            $totalEmployees = $totalQuery->count();

            // Appliquer le tri
            $this->applySorting($query, $sortBy);

            // Appliquer la pagination
            $employees = $query->offset(($page - 1) * $limit)
                             ->limit($limit)
                             ->get();

            // Transformer les données
            $analyticsData = $employees->map(function ($employee) use ($creator) {
                $progress = $employee->progress->first();
                
                // Calculer les métriques
                $totalVideos = Video::where('creator_id', $creator->id)->count();
                $watchedVideos = $progress ? $progress->videos_watched : 0;
                $timeSpent = $progress ? $progress->time_spent : 0;
                $progressPercentage = $totalVideos > 0 ? ($watchedVideos / $totalVideos) * 100 : 0;
                
                // Calculer le score d'engagement
                $engagementScore = $this->calculateEngagementScore($employee, $progress);
                
                // Récupérer les certificats et milestones
                $certificates = $this->getCertificatesCount($employee, $creator);
                $milestones = $this->getMilestonesData($employee, $creator);

                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'department' => $employee->department,
                    'progress' => round($progressPercentage),
                    'completion_rate' => round($progressPercentage),
                    'videos_watched' => $watchedVideos,
                    'time_spent' => $timeSpent,
                    'last_active' => $progress ? $progress->updated_at->toISOString() : $employee->created_at->toISOString(),
                    'courses_enrolled' => $totalVideos > 0 ? 1 : 0,
                    'courses_completed' => $progressPercentage >= 90 ? 1 : 0,
                    'average_score' => $progress ? $progress->average_score : 0,
                    'engagement_score' => $engagementScore,
                    'learning_path' => $this->getLearningPath($employee, $creator),
                    'milestones_achieved' => $milestones['achieved'],
                    'total_milestones' => $milestones['total'],
                    'streak_days' => $this->calculateStreakDays($employee, $progress),
                    'certificates_earned' => $certificates
                ];
            });

            // Calculer le résumé
            $summary = $this->calculateSummary($analyticsData, $creator, $startDate);

            // Générer les tendances de performance
            $trends = $this->generatePerformanceTrends($creator, $dateRange);

            return response()->json([
                'success' => true,
                'data' => [
                    'employees' => $analyticsData,
                    'summary' => $summary,
                    'performance_trends' => $trends
                ],
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $totalEmployees,
                    'pages' => ceil($totalEmployees / $limit)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calcule la date de début selon le range
     */
    private function calculateStartDate(string $dateRange): Carbon
    {
        $now = Carbon::now();
        
        switch ($dateRange) {
            case '7d':
                return $now->subDays(7);
            case '30d':
                return $now->subDays(30);
            case '90d':
                return $now->subDays(90);
            case '1y':
                return $now->subYear();
            default:
                return $now->subDays(30);
        }
    }

    /**
     * Applique le tri sur la requête
     */
    private function applySorting($query, string $sortBy): void
    {
        switch ($sortBy) {
            case 'engagement':
                $query->orderBy('engagement_score', 'desc');
                break;
            case 'time_spent':
                $query->orderBy('time_spent', 'desc');
                break;
            case 'completion_rate':
                $query->orderBy('completion_rate', 'desc');
                break;
            case 'last_active':
                $query->orderBy('updated_at', 'desc');
                break;
            case 'progress':
            default:
                $query->orderBy('progress', 'desc');
                break;
        }
    }

    /**
     * Calcule le score d'engagement
     */
    private function calculateEngagementScore($employee, $progress): int
    {
        if (!$progress) {
            return 0;
        }

        $score = 0;
        
        // Score basé sur le temps passé (40%)
        $timeScore = min(40, ($progress->time_spent / 60) * 2); // 2 points par heure, max 40
        
        // Score basé sur les vidéos regardées (30%)
        $videoScore = min(30, $progress->videos_watched * 3); // 3 points par vidéo, max 30
        
        // Score basé sur la régularité (20%)
        $daysSinceLastActivity = $progress->updated_at->diffInDays(now());
        $regularityScore = max(0, 20 - ($daysSinceLastActivity * 2));
        
        // Score basé sur la progression (10%)
        $progressScore = $progress->progress * 0.1;
        
        return round($timeScore + $videoScore + $regularityScore + $progressScore);
    }

    /**
     * Récupère le nombre de certificats
     */
    private function getCertificatesCount($employee, $creator): int
    {
        // Implémenter la logique des certificats
        return DB::table('employee_certificates')
            ->where('employee_id', $employee->id)
            ->where('creator_id', $creator->id)
            ->count();
    }

    /**
     * Récupère les données de milestones
     */
    private function getMilestonesData($employee, $creator): array
    {
        $total = 10; // Nombre total de milestones par défaut
        $achieved = DB::table('employee_milestones')
            ->where('employee_id', $employee->id)
            ->where('creator_id', $creator->id)
            ->where('achieved', true)
            ->count();
            
        return [
            'achieved' => $achieved,
            'total' => $total
        ];
    }

    /**
     * Calcule les jours de streak
     */
    private function calculateStreakDays($employee, $progress): int
    {
        if (!$progress) {
            return 0;
        }

        // Implémenter la logique de streak
        $lastActivity = $progress->updated_at;
        $today = Carbon::now();
        
        if ($lastActivity->isToday()) {
            return 1;
        }
        
        if ($lastActivity->isYesterday()) {
            return 2;
        }
        
        // Calculer les jours consécutifs
        $streak = 0;
        $currentDate = $lastActivity->copy();
        
        while ($currentDate->gte($today->subDays(30))) {
            $hasActivity = DB::table('employee_activities')
                ->where('employee_id', $employee->id)
                ->whereDate('created_at', $currentDate->format('Y-m-d'))
                ->exists();
                
            if ($hasActivity) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }
        
        return $streak;
    }

    /**
     * Récupère le parcours d'apprentissage
     */
    private function getLearningPath($employee, $creator): string
    {
        // Implémenter la logique du parcours d'apprentissage
        return "Parcours personnalisé";
    }

    /**
     * Calcule le résumé des analytics
     */
    private function calculateSummary($employees, $creator, $startDate): array
    {
        $totalEmployees = $employees->count();
        $activeEmployees = $employees->filter(function ($employee) {
            $lastActive = new Carbon($employee['last_active']);
            return $lastActive->gte(now()->subDays(7));
        })->count();
        
        $averageProgress = $totalEmployees > 0 
            ? round($employees->sum('progress') / $totalEmployees) 
            : 0;
            
        $totalTimeSpent = $employees->sum('time_spent');
        $totalVideosWatched = $employees->sum('videos_watched');
        
        $completionRate = $totalEmployees > 0 
            ? round($employees->sum('completion_rate') / $totalEmployees) 
            : 0;
            
        $engagementRate = $totalEmployees > 0 
            ? round($employees->sum('engagement_score') / $totalEmployees) 
            : 0;
        
        $topPerformer = $employees->sortByDesc('progress')->first();
        $improvementNeeded = $employees->filter(function ($employee) {
            return $employee['progress'] < 70;
        })->values();

        return [
            'total_employees' => $totalEmployees,
            'active_employees' => $activeEmployees,
            'average_progress' => $averageProgress,
            'total_time_spent' => $totalTimeSpent,
            'total_videos_watched' => $totalVideosWatched,
            'completion_rate' => $completionRate,
            'engagement_rate' => $engagementRate,
            'top_performer' => $topPerformer,
            'improvement_needed' => $improvementNeeded
        ];
    }

    /**
     * Génère les tendances de performance
     */
    private function generatePerformanceTrends($creator, $dateRange): array
    {
        $startDate = $this->calculateStartDate($dateRange);
        
        // Générer les tendances quotidiennes
        $daily = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $activeUsers = DB::table('employee_activities')
                ->where('creator_id', $creator->id)
                ->whereDate('created_at', $date->format('Y-m-d'))
                ->distinct('employee_id')
                ->count();
                
            $completionRate = $this->getDailyCompletionRate($creator, $date);
            
            $daily[] = [
                'date' => $date->format('Y-m-d'),
                'active_users' => $activeUsers,
                'completion_rate' => $completionRate
            ];
        }

        // Générer les tendances hebdomadaires
        $weekly = [];
        for ($i = 3; $i >= 0; $i--) {
            $weekStart = now()->subWeeks($i);
            $weekEnd = $weekStart->copy()->endOfWeek();
            
            $progress = $this->getWeeklyProgress($creator, $weekStart, $weekEnd);
            $engagement = $this->getWeeklyEngagement($creator, $weekStart, $weekEnd);
            
            $weekly[] = [
                'week' => "Semaine " . (4 - $i),
                'progress' => $progress,
                'engagement' => $engagement
            ];
        }

        // Générer les tendances mensuelles
        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            
            $videosWatched = DB::table('employee_progress')
                ->where('creator_id', $creator->id)
                ->whereYear('updated_at', $month->year)
                ->whereMonth('updated_at', $month->month)
                ->sum('videos_watched');
                
            $timeSpent = DB::table('employee_progress')
                ->where('creator_id', $creator->id)
                ->whereYear('updated_at', $month->year)
                ->whereMonth('updated_at', $month->month)
                ->sum('time_spent');
            
            $monthly[] = [
                'month' => $month->locale('fr_FR')->format('F Y'),
                'videos_watched' => $videosWatched,
                'time_spent' => $timeSpent
            ];
        }

        return [
            'daily' => $daily,
            'weekly' => $weekly,
            'monthly' => $monthly
        ];
    }

    /**
     * Calcule le taux de complétion quotidien
     */
    private function getDailyCompletionRate($creator, $date): int
    {
        $totalEmployees = Employee::where('creator_id', $creator->id)->count();
        
        if ($totalEmployees === 0) {
            return 0;
        }
        
        $completedEmployees = DB::table('employee_progress')
            ->where('creator_id', $creator->id)
            ->whereDate('updated_at', $date->format('Y-m-d'))
            ->where('progress', '>=', 90)
            ->distinct('employee_id')
            ->count();
            
        return round(($completedEmployees / $totalEmployees) * 100);
    }

    /**
     * Calcule la progression hebdomadaire
     */
    private function getWeeklyProgress($creator, $weekStart, $weekEnd): int
    {
        $totalEmployees = Employee::where('creator_id', $creator->id)->count();
        
        if ($totalEmployees === 0) {
            return 0;
        }
        
        $avgProgress = DB::table('employee_progress')
            ->where('creator_id', $creator->id)
            ->whereBetween('updated_at', [$weekStart, $weekEnd])
            ->avg('progress');
            
        return round($avgProgress ?? 0);
    }

    /**
     * Calcule l'engagement hebdomadaire
     */
    private function getWeeklyEngagement($creator, $weekStart, $weekEnd): int
    {
        $totalEmployees = Employee::where('creator_id', $creator->id)->count();
        
        if ($totalEmployees === 0) {
            return 0;
        }
        
        $activeEmployees = DB::table('employee_activities')
            ->where('creator_id', $creator->id)
            ->whereBetween('created_at', [$weekStart, $weekEnd])
            ->distinct('employee_id')
            ->count();
            
        return round(($activeEmployees / $totalEmployees) * 100);
    }
}
