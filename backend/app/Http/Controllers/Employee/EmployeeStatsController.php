<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\EmployeePathway;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmployeeStatsController extends Controller
{
    /**
     * Obtenir les statistiques du dashboard employé
     */
    public function dashboard()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Vérifier si l'utilisateur est un employé
            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            // Statistiques de progression des vidéos
            $videoStats = EmployeeProgress::where('employee_id', $employee->id)
                ->selectRaw('
                    COUNT(*) as total_courses,
                    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_courses,
                    SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as in_progress_courses,
                    AVG(progress_percentage) as average_progress,
                    SUM(watch_time_seconds) as total_watch_time_seconds
                ')
                ->first();

            // Statistiques des parcours
            $pathwayStats = EmployeePathway::where('employee_id', $employee->id)
                ->selectRaw('
                    COUNT(*) as total_pathways,
                    SUM(CASE WHEN progress_percentage >= 100 THEN 1 ELSE 0 END) as completed_pathways,
                    AVG(progress_percentage) as average_pathway_progress
                ')
                ->first();

            // Certificats (parcours complétés)
            $certificatesCount = EmployeePathway::where('employee_id', $employee->id)
                ->where('progress_percentage', '>=', 100)
                ->count();

            // Cours récents avec progression
            $recentCourses = EmployeeProgress::with(['video'])
                ->where('employee_id', $employee->id)
                ->orderBy('last_watched_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($progress) {
                    return [
                        'id' => $progress->video->id,
                        'title' => $progress->video->title,
                        'description' => $progress->video->description,
                        'thumbnail' => $progress->video->thumbnail,
                        'video_url' => $progress->video->video_url,
                        'duration' => $progress->video->duration,
                        'views' => $progress->video->views,
                        'likes' => $progress->video->likes,
                        'comments' => $progress->video->comments,
                        'publishedAt' => $progress->video->created_at,
                        'visibility' => $progress->video->visibility,
                        'status' => $progress->video->status,
                        'progress' => $progress->progress_percentage,
                        'completed' => $progress->completed,
                        'last_watched_at' => $progress->last_watched_at,
                        'creator' => [
                            'name' => $progress->video->uploader->name ?? 'Formateur',
                            'domain' => 'marketing'
                        ]
                    ];
                });

            // Activité récente
            $recentActivity = EmployeeProgress::with(['video'])
                ->where('employee_id', $employee->id)
                ->orderBy('last_watched_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($progress) {
                    return [
                        'id' => $progress->id,
                        'type' => $progress->completed ? 'course_completed' : 'course_watched',
                        'message' => $progress->completed 
                            ? `Cours "${$progress->video->title}" terminé`
                            : `Cours "${$progress->video->title}" visionné`,
                        'created_at' => $progress->last_watched_at,
                        'course_title' => $progress->video->title,
                        'progress' => $progress->progress_percentage
                    ];
                });

            $stats = [
                'total_courses' => $videoStats->total_courses ?? 0,
                'completed_courses' => $videoStats->completed_courses ?? 0,
                'in_progress_courses' => $videoStats->in_progress_courses ?? 0,
                'total_watch_time' => round(($videoStats->total_watch_time_seconds ?? 0) / 60), // en minutes
                'certificates_earned' => $certificatesCount,
                'average_progress' => round($videoStats->average_progress ?? 0, 2),
                'completion_rate' => $videoStats->total_courses > 0 
                    ? round((($videoStats->completed_courses ?? 0) / $videoStats->total_courses) * 100, 2)
                    : 0,
                'total_pathways' => $pathwayStats->total_pathways ?? 0,
                'completed_pathways' => $pathwayStats->completed_pathways ?? 0,
                'average_pathway_progress' => round($pathwayStats->average_pathway_progress ?? 0, 2),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'recent_courses' => $recentCourses,
                    'recent_activity' => $recentActivity
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
     * Mettre à jour la progression d'un employé pour une vidéo
     */
    public function updateProgress()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            $videoId = request('video_id');
            $watchTimeSeconds = request('watch_time_seconds');
            $totalDurationSeconds = request('total_duration_seconds');

            if (!$videoId || !$watchTimeSeconds || !$totalDurationSeconds) {
                return response()->json(['error' => 'Paramètres manquants'], 400);
            }

            $progress = EmployeeProgress::updateProgress(
                $employee->id,
                $videoId,
                $watchTimeSeconds,
                $totalDurationSeconds
            );

            return response()->json([
                'success' => true,
                'data' => $progress
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques détaillées de progression
     */
    public function getDetailedStats()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            // Progression par jour (30 derniers jours)
            $dailyProgress = EmployeeProgress::where('employee_id', $employee->id)
                ->where('last_watched_at', '>=', now()->subDays(30))
                ->selectRaw('
                    DATE(last_watched_at) as date,
                    COUNT(*) as videos_watched,
                    SUM(watch_time_seconds) as total_watch_time,
                    AVG(progress_percentage) as average_progress
                ')
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get();

            // Progression par catégorie
            $categoryProgress = DB::table('employee_progress')
                ->join('videos', 'employee_progress.video_id', '=', 'videos.id')
                ->where('employee_progress.employee_id', $employee->id)
                ->selectRaw('
                    videos.category,
                    COUNT(*) as total_videos,
                    SUM(CASE WHEN employee_progress.completed = 1 THEN 1 ELSE 0 END) as completed_videos,
                    AVG(employee_progress.progress_percentage) as average_progress
                ')
                ->groupBy('videos.category')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_progress' => $dailyProgress,
                    'category_progress' => $categoryProgress
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
