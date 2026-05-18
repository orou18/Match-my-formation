<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePathway;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeStatsController extends Controller
{
    public function dashboard(Request $request)
    {
        $employee = $this->employee($request);
        $progress = EmployeeProgress::with('video')
            ->where('employee_id', $employee->id)
            ->get();

        $pathwayStats = EmployeePathway::where('employee_id', $employee->id)
            ->selectRaw('COUNT(*) as total_pathways, SUM(CASE WHEN progress_percentage >= 100 THEN 1 ELSE 0 END) as completed_pathways, AVG(progress_percentage) as average_pathway_progress')
            ->first();

        $completed = $progress->where('completed', true)->count();
        $total = $progress->count();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_courses' => $total,
                    'completed_courses' => $completed,
                    'in_progress_courses' => $progress->where('completed', false)->where('progress_percentage', '>', 0)->count(),
                    'total_watch_time' => round($progress->sum('watch_time_seconds') / 60),
                    'certificates_earned' => $completed >= 5 ? intdiv($completed, 5) : 0,
                    'average_progress' => round((float) $progress->avg('progress_percentage'), 2),
                    'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
                    'total_pathways' => (int) ($pathwayStats->total_pathways ?? 0),
                    'completed_pathways' => (int) ($pathwayStats->completed_pathways ?? 0),
                    'average_pathway_progress' => round((float) ($pathwayStats->average_pathway_progress ?? 0), 2),
                ],
                'recent_courses' => $progress
                    ->sortByDesc('last_watched_at')
                    ->take(5)
                    ->map(fn (EmployeeProgress $item) => [
                        'id' => $item->video?->id,
                        'title' => $item->video?->title,
                        'description' => $item->video?->description,
                        'thumbnail' => $item->video?->thumbnail_url,
                        'video_url' => $item->video?->video_url,
                        'duration' => $item->video?->duration,
                        'views' => $item->video?->views ?? 0,
                        'likes' => $item->video?->likes ?? 0,
                        'comments' => $item->video?->comments ?? 0,
                        'publishedAt' => $item->video?->published_at?->toISOString(),
                        'visibility' => $item->video?->visibility,
                        'status' => $item->completed ? 'completed' : 'in_progress',
                        'progress' => (float) $item->progress_percentage,
                        'completed' => (bool) $item->completed,
                        'last_watched_at' => $item->last_watched_at?->toISOString(),
                    ])
                    ->values(),
                'recent_activity' => $progress
                    ->sortByDesc('last_watched_at')
                    ->take(10)
                    ->map(fn (EmployeeProgress $item) => [
                        'id' => $item->id,
                        'type' => $item->completed ? 'course_completed' : 'course_watched',
                        'message' => $item->completed
                            ? 'Cours "' . ($item->video?->title ?? 'Vidéo') . '" terminé'
                            : 'Cours "' . ($item->video?->title ?? 'Vidéo') . '" visionné',
                        'created_at' => $item->last_watched_at?->toISOString(),
                        'course_title' => $item->video?->title,
                        'progress' => (float) $item->progress_percentage,
                    ])
                    ->values(),
            ],
        ]);
    }

    public function updateProgress(Request $request)
    {
        $employee = $this->employee($request);
        $validated = $request->validate([
            'video_id' => 'required|exists:videos,id',
            'watch_time_seconds' => 'required|integer|min:0',
            'total_duration_seconds' => 'required|integer|min:0',
        ]);

        $progress = EmployeeProgress::updateProgress(
            $employee->id,
            (int) $validated['video_id'],
            (int) $validated['watch_time_seconds'],
            (int) $validated['total_duration_seconds']
        );

        return response()->json(['success' => true, 'data' => $progress]);
    }

    public function getDetailedStats(Request $request)
    {
        $employee = $this->employee($request);

        $dailyProgress = EmployeeProgress::where('employee_id', $employee->id)
            ->where('last_watched_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(last_watched_at) as date, COUNT(*) as videos_watched, SUM(watch_time_seconds) as total_watch_time, AVG(progress_percentage) as average_progress')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        $categoryProgress = DB::table('employee_progress')
            ->join('videos', 'employee_progress.video_id', '=', 'videos.id')
            ->where('employee_progress.employee_id', $employee->id)
            ->selectRaw('videos.category, COUNT(*) as total_videos, SUM(CASE WHEN employee_progress.completed = 1 THEN 1 ELSE 0 END) as completed_videos, AVG(employee_progress.progress_percentage) as average_progress')
            ->groupBy('videos.category')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'daily_progress' => $dailyProgress,
                'category_progress' => $categoryProgress,
            ],
        ]);
    }

    private function employee(Request $request): Employee
    {
        $user = $request->user();
        if ($user instanceof Employee) {
            return $user;
        }

        abort(401, 'Unauthorized');
    }
}
