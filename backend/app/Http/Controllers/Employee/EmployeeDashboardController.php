<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\Video;
use Illuminate\Http\Request;

class EmployeeDashboardController extends Controller
{
    public function getMe(Request $request)
    {
        $employee = $this->employee($request);

        return response()->json([
            'success' => true,
            'data' => $employee->load('creator:id,name,email,avatar'),
        ]);
    }

    public function getCourses(Request $request)
    {
        $employee = $this->employee($request);

        $videos = $this->accessibleVideos($employee)
            ->map(fn (Video $video) => $this->serializeVideo($video, $employee))
            ->values();

        return response()->json(['success' => true, 'data' => $videos]);
    }

    public function getStats(Request $request)
    {
        $employee = $this->employee($request);
        $accessibleVideoIds = $this->accessibleVideos($employee)->pluck('id');
        $progress = EmployeeProgress::where('employee_id', $employee->id)
            ->whereIn('video_id', $accessibleVideoIds)
            ->get();

        $completed = $progress->where('completed', true)->count();
        $inProgress = $progress
            ->where('completed', false)
            ->where('progress_percentage', '>', 0)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_courses' => $accessibleVideoIds->count(),
                'completed_courses' => $completed,
                'in_progress_courses' => $inProgress,
                'total_watch_time' => round($progress->sum('watch_time_seconds') / 60),
                'certificates_earned' => $completed >= 5 ? intdiv($completed, 5) : 0,
                'completion_rate' => $accessibleVideoIds->count() > 0
                    ? round(($completed / $accessibleVideoIds->count()) * 100, 1)
                    : 0,
                'average_score' => 0,
                'streak_days' => $this->calculateStreak($employee->id),
            ],
        ]);
    }

    public function getRecentActivity(Request $request)
    {
        $employee = $this->employee($request);

        $activity = EmployeeProgress::with('video:id,title,thumbnail,duration')
            ->where('employee_id', $employee->id)
            ->whereNotNull('last_watched_at')
            ->latest('last_watched_at')
            ->limit(10)
            ->get()
            ->map(fn (EmployeeProgress $progress) => [
                'video' => [
                    'id' => $progress->video?->id,
                    'title' => $progress->video?->title,
                    'thumbnail' => $progress->video?->thumbnail_url,
                ],
                'watched_duration' => $progress->watch_time_seconds,
                'is_completed' => (bool) $progress->completed,
                'last_watched_at' => $progress->last_watched_at?->toISOString(),
                'progress_percentage' => (float) $progress->progress_percentage,
            ])
            ->values();

        return response()->json(['success' => true, 'data' => $activity]);
    }

    public function updateProgress(Request $request, $videoId)
    {
        $employee = $this->employee($request);
        $video = $this->accessibleVideos($employee)->firstWhere('id', (int) $videoId);

        if (!$video) {
            return response()->json(['error' => 'Vidéo non trouvée ou non accessible'], 404);
        }

        $validated = $request->validate([
            'watch_time_seconds' => 'nullable|integer|min:0',
            'total_duration_seconds' => 'nullable|integer|min:0',
            'watch_time' => 'nullable|integer|min:0',
            'progress' => 'nullable|numeric|min:0|max:100',
        ]);

        $total = (int) ($validated['total_duration_seconds'] ?? $video->duration ?? 0);
        $watch = (int) ($validated['watch_time_seconds'] ?? $validated['watch_time'] ?? 0);

        if (isset($validated['progress']) && $total > 0 && $watch === 0) {
            $watch = (int) round(($validated['progress'] / 100) * $total);
        }

        $progress = EmployeeProgress::updateProgress($employee->id, (int) $videoId, $watch, $total);
        $video->increment('views');

        return response()->json([
            'success' => true,
            'message' => 'Progression mise à jour avec succès',
            'data' => $progress,
        ]);
    }

    public function completeVideo(Request $request, $videoId)
    {
        $employee = $this->employee($request);
        $video = $this->accessibleVideos($employee)->firstWhere('id', (int) $videoId);

        if (!$video) {
            return response()->json(['error' => 'Vidéo non trouvée ou non accessible'], 404);
        }

        $duration = (int) ($video->duration ?? 0);
        $progress = EmployeeProgress::updateProgress($employee->id, (int) $videoId, $duration, $duration);

        return response()->json([
            'success' => true,
            'message' => 'Vidéo marquée comme terminée',
            'data' => $progress,
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

    private function accessibleVideos(Employee $employee)
    {
        return Video::with(['creator:id,name,email,avatar', 'pathways.employeePathways', 'pathways'])
            ->where(function ($query) use ($employee) {
                $query
                    ->where(function ($public) {
                        $public->where('visibility', 'public')->whereNotNull('published_at');
                    })
                    ->orWhereHas('pathways.employeePathways', function ($assignment) use ($employee) {
                        $assignment->where('employee_id', $employee->id)->where('is_active', true);
                    });
            })
            ->latest()
            ->get();
    }

    private function serializeVideo(Video $video, Employee $employee): array
    {
        $progress = EmployeeProgress::where('employee_id', $employee->id)
            ->where('video_id', $video->id)
            ->first();

        return [
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'thumbnail' => $video->thumbnail_url,
            'video_url' => $video->video_url,
            'duration' => $video->duration,
            'views' => (int) $video->views,
            'likes' => (int) $video->likes,
            'comments' => (int) $video->comments,
            'publishedAt' => $video->published_at?->toISOString() ?? $video->created_at?->toISOString(),
            'visibility' => $video->visibility,
            'status' => $progress?->completed ? 'completed' : 'in_progress',
            'progress' => (float) ($progress?->progress_percentage ?? 0),
            'completed' => (bool) ($progress?->completed ?? false),
            'creator' => [
                'name' => $video->creator?->name ?? 'Formateur',
                'domain' => $video->category ?? 'formation',
            ],
            'last_watched_at' => $progress?->last_watched_at?->toISOString(),
            'watch_time' => (int) ($progress?->watch_time_seconds ?? 0),
        ];
    }

    private function calculateStreak(int $employeeId): int
    {
        $streak = 0;
        $date = now();

        for ($i = 0; $i < 365; $i++) {
            $hasActivity = EmployeeProgress::where('employee_id', $employeeId)
                ->whereDate('last_watched_at', $date->toDateString())
                ->exists();

            if (!$hasActivity) {
                break;
            }

            $streak++;
            $date->subDay();
        }

        return $streak;
    }
}
