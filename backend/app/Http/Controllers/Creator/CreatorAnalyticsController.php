<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePathway;
use App\Models\EmployeeProgress;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreatorAnalyticsController extends Controller
{
    public function getEmployeeAnalytics(Request $request): JsonResponse
    {
        $creator = $request->user();

        if (!$creator) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        $limit = max(1, min((int) $request->input('limit', 10), 100));
        $page = max(1, (int) $request->input('page', 1));
        $creatorVideoIds = Video::where('uploader_id', $creator->id)->pluck('id');
        $totalCreatorVideos = $creatorVideoIds->count();

        $query = Employee::where('creator_id', $creator->id)
            ->with(['progress' => fn ($query) => $query->whereIn('video_id', $creatorVideoIds)]);

        if ($request->filled('department') && $request->input('department') !== 'all') {
            $query->where('department', $request->input('department'));
        }

        $total = (clone $query)->count();
        $employees = $query
            ->latest()
            ->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        $analyticsData = $employees->map(function (Employee $employee) use ($totalCreatorVideos, $creator) {
            $progressRows = $employee->progress;
            $completed = $progressRows->where('completed', true)->count();
            $watched = $progressRows->count();
            $averageProgress = round($progressRows->avg('progress_percentage') ?? 0, 2);
            $timeSpentMinutes = round(($progressRows->sum('watch_time_seconds') ?? 0) / 60);
            $lastProgress = $progressRows
                ->filter(fn (EmployeeProgress $progress) => $progress->last_watched_at)
                ->sortByDesc('last_watched_at')
                ->first();
            $pathways = EmployeePathway::where('creator_id', $creator->id)
                ->where('employee_id', $employee->id)
                ->count();

            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'department' => $employee->department,
                'progress' => $averageProgress,
                'completion_rate' => $totalCreatorVideos > 0 ? round(($completed / $totalCreatorVideos) * 100, 2) : 0,
                'videos_watched' => $watched,
                'time_spent' => $timeSpentMinutes,
                'last_active' => optional($lastProgress?->last_watched_at)->toISOString() ?? optional($employee->updated_at)->toISOString(),
                'courses_enrolled' => $pathways,
                'courses_completed' => EmployeePathway::where('creator_id', $creator->id)
                    ->where('employee_id', $employee->id)
                    ->whereNotNull('completed_at')
                    ->count(),
                'average_score' => 0,
                'engagement_score' => min(100, round(($averageProgress * 0.7) + min(30, $watched * 3))),
                'learning_path' => '',
                'milestones_achieved' => $completed,
                'total_milestones' => $totalCreatorVideos,
                'streak_days' => 0,
                'certificates_earned' => 0,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'employees' => $analyticsData,
                'summary' => [
                    'total_employees' => $total,
                    'active_employees' => $analyticsData->where('videos_watched', '>', 0)->count(),
                    'average_progress' => round($analyticsData->avg('progress') ?? 0, 2),
                    'total_time_spent' => $analyticsData->sum('time_spent'),
                    'total_videos_watched' => $analyticsData->sum('videos_watched'),
                    'completion_rate' => round($analyticsData->avg('completion_rate') ?? 0, 2),
                    'engagement_rate' => round($analyticsData->avg('engagement_score') ?? 0, 2),
                    'top_performer' => $analyticsData->sortByDesc('progress')->first(),
                    'improvement_needed' => $analyticsData->where('progress', '<', 40)->values(),
                ],
                'performance_trends' => [
                    'daily' => [],
                    'weekly' => [],
                    'monthly' => [],
                ],
            ],
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => (int) ceil($total / $limit),
            ],
        ]);
    }
}
