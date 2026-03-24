<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EmployeeProgressController extends Controller
{
    /**
     * Obtenir la progression globale de tous les employés (pour le créateur)
     */
    public function globalProgress(): JsonResponse
    {
        $creatorId = Auth::id();
        
        $employees = Employee::where('creator_id', $creatorId)->get();
        
        $globalStats = [
            'total_employees' => $employees->count(),
            'active_employees' => $employees->where('is_active', true)->count(),
            'total_watch_time' => 0,
            'average_completion_rate' => 0,
            'top_performers' => [],
            'by_domain' => [],
        ];

        $allStats = [];
        $byDomain = [];

        foreach ($employees as $employee) {
            $stats = EmployeeProgress::getEmployeeStats($employee->id);
            $allStats[] = [
                'employee' => $employee,
                'stats' => $stats
            ];

            // Stats par domaine
            $domain = $employee->domain;
            if (!isset($byDomain[$domain])) {
                $byDomain[$domain] = [
                    'domain' => $domain,
                    'total_employees' => 0,
                    'total_watch_time' => 0,
                    'average_completion_rate' => 0,
                ];
            }
            $byDomain[$domain]['total_employees']++;
            $byDomain[$domain]['total_watch_time'] += $stats['total_watch_time_minutes'];
            $byDomain[$domain]['average_completion_rate'] += $stats['completion_rate'];
            
            $globalStats['total_watch_time'] += $stats['total_watch_time_minutes'];
        }

        // Calculer les moyennes
        foreach ($byDomain as $domain => &$data) {
            $data['average_completion_rate'] = $data['total_employees'] > 0 
                ? round($data['average_completion_rate'] / $data['total_employees'], 2)
                : 0;
        }

        // Top performers
        usort($allStats, function ($a, $b) {
            return $b['stats']['completion_rate'] <=> $a['stats']['completion_rate'];
        });
        $globalStats['top_performers'] = array_slice($allStats, 0, 5);
        $globalStats['by_domain'] = array_values($byDomain);
        
        $globalStats['average_completion_rate'] = count($allStats) > 0
            ? round(array_sum(array_column($allStats, 'stats.completion_rate')) / count($allStats), 2)
            : 0;

        return response()->json([
            'success' => true,
            'data' => $globalStats
        ]);
    }

    /**
     * Obtenir la progression individuelle d'un employé
     */
    public function employeeProgress(string $employeeId): JsonResponse
    {
        $creatorId = Auth::id();
        
        $employee = Employee::where('creator_id', $creatorId)
            ->where('id', $employeeId)
            ->firstOrFail();

        $stats = EmployeeProgress::getEmployeeStats($employee->id);
        
        // Progression détaillée par vidéo
        $detailedProgress = EmployeeProgress::where('employee_id', $employee->id)
            ->with(['video'])
            ->orderBy('last_watched_at', 'desc')
            ->get()
            ->map(function ($progress) {
                return [
                    'video_id' => $progress->video_id,
                    'video_title' => $progress->video->title ?? 'Vidéo supprimée',
                    'watch_time_seconds' => $progress->watch_time_seconds,
                    'total_duration_seconds' => $progress->total_duration_seconds,
                    'progress_percentage' => $progress->progress_percentage,
                    'completed' => $progress->completed,
                    'last_watched_at' => $progress->last_watched_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => $employee,
                'stats' => $stats,
                'detailed_progress' => $detailedProgress
            ]
        ]);
    }

    /**
     * Mettre à jour la progression d'une vidéo (pour l'employé)
     */
    public function updateProgress(Request $request): JsonResponse
    {
        $request->validate([
            'video_id' => 'required|integer',
            'watch_time_seconds' => 'required|integer|min:0',
            'total_duration_seconds' => 'required|integer|min:0',
        ]);

        $employee = $request->user();
        
        $progress = EmployeeProgress::updateProgress(
            $employee->id,
            $request->video_id,
            $request->watch_time_seconds,
            $request->total_duration_seconds
        );

        return response()->json([
            'success' => true,
            'data' => $progress,
            'message' => 'Progression mise à jour'
        ]);
    }

    /**
     * Obtenir la progression par cours
     */
    public function courseProgress(string $employeeId): JsonResponse
    {
        $creatorId = Auth::id();
        
        $employee = Employee::where('creator_id', $creatorId)
            ->where('id', $employeeId)
            ->firstOrFail();

        $courseProgress = EmployeeProgress::where('employee_id', $employee->id)
            ->with(['video'])
            ->get()
            ->groupBy(function ($item) {
                // Grouper par "cours" (ici on utilise la catégorie de la vidéo)
                return $item->video->category ?? 'General';
            })
            ->map(function ($group, $category) {
                $totalVideos = $group->count();
                $completedVideos = $group->where('completed', true)->count();
                $averageProgress = $group->avg('progress_percentage');
                $totalWatchTime = $group->sum('watch_time_seconds');

                return [
                    'category' => $category,
                    'total_videos' => $totalVideos,
                    'completed_videos' => $completedVideos,
                    'completion_rate' => $totalVideos > 0 ? round(($completedVideos / $totalVideos) * 100, 2) : 0,
                    'average_progress' => round($averageProgress, 2),
                    'total_watch_time_minutes' => round($totalWatchTime / 60),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => $employee,
                'course_progress' => $courseProgress->values()
            ]
        ]);
    }
}
