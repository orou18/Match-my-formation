<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePathway;
use App\Models\EmployeeProgress;
use App\Models\Pathway;
use Illuminate\Http\Request;

class EmployeePathwayController extends Controller
{
    public function getPathways(Request $request)
    {
        $employee = $this->employee($request);

        $assigned = EmployeePathway::with(['pathway.creator:id,name,email,avatar', 'pathway.videos'])
            ->where('employee_id', $employee->id)
            ->where('is_active', true)
            ->latest('assigned_at')
            ->get()
            ->map(fn (EmployeePathway $assignment) => $this->serializeAssignment($assignment, $employee));

        $public = Pathway::with(['creator:id,name,email,avatar', 'videos'])
            ->where('is_active', true)
            ->where('creator_id', '!=', $employee->creator_id)
            ->latest()
            ->get()
            ->map(fn (Pathway $pathway) => $this->serializePathway($pathway, $employee));

        return response()->json([
            'success' => true,
            'data' => $assigned->concat($public)->values(),
        ]);
    }

    public function getPathwayDetails(Request $request, $pathwayId)
    {
        $employee = $this->employee($request);
        $pathway = Pathway::with(['creator:id,name,email,avatar', 'videos'])
            ->where('id', $pathwayId)
            ->where(function ($query) use ($employee) {
                $query->where('is_active', true)
                    ->orWhereHas('employeePathways', fn ($assignment) => $assignment
                        ->where('employee_id', $employee->id)
                        ->where('is_active', true));
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $this->serializePathway($pathway, $employee, true),
        ]);
    }

    public function startPathway(Request $request, $pathwayId)
    {
        $employee = $this->employee($request);
        $pathway = Pathway::where('id', $pathwayId)->where('is_active', true)->firstOrFail();

        $assignment = EmployeePathway::firstOrCreate(
            ['employee_id' => $employee->id, 'pathway_id' => $pathway->id],
            [
                'creator_id' => $pathway->creator_id,
                'assigned_at' => now(),
                'progress_percentage' => 0,
                'is_active' => true,
            ]
        );

        return response()->json(['success' => true, 'data' => $this->serializeAssignment($assignment->load('pathway.videos'), $employee)]);
    }

    public function updatePathwayProgress(Request $request, $pathwayId)
    {
        $employee = $this->employee($request);
        $validated = $request->validate(['progress_percentage' => 'required|numeric|min:0|max:100']);
        $assignment = EmployeePathway::where('employee_id', $employee->id)
            ->where('pathway_id', $pathwayId)
            ->firstOrFail();

        $assignment->updateProgress((float) $validated['progress_percentage']);

        return response()->json(['success' => true, 'data' => $assignment->fresh()]);
    }

    public function getAvailablePathways(Request $request)
    {
        return $this->getPathways($request);
    }

    private function employee(Request $request): Employee
    {
        $user = $request->user();
        if ($user instanceof Employee) {
            return $user;
        }

        abort(401, 'Unauthorized');
    }

    private function serializeAssignment(EmployeePathway $assignment, Employee $employee): array
    {
        return [
            ...$this->serializePathway($assignment->pathway, $employee),
            'assigned_at' => $assignment->assigned_at?->toDateString(),
            'completed_at' => $assignment->completed_at?->toDateString(),
            'progress_percentage' => (float) $assignment->progress_percentage,
            'is_active' => (bool) $assignment->is_active,
            'status' => $assignment->isCompleted() ? 'completed' : 'active',
        ];
    }

    private function serializePathway(Pathway $pathway, Employee $employee, bool $withVideos = false): array
    {
        $videoIds = $pathway->videos->pluck('id');
        $completedVideos = EmployeeProgress::where('employee_id', $employee->id)
            ->whereIn('video_id', $videoIds)
            ->where('completed', true)
            ->count();
        $progress = $videoIds->count() > 0 ? round(($completedVideos / $videoIds->count()) * 100, 1) : 0;

        $payload = [
            'id' => $pathway->id,
            'title' => $pathway->title,
            'description' => $pathway->description,
            'creator' => [
                'id' => $pathway->creator?->id,
                'name' => $pathway->creator?->name,
                'avatar' => $pathway->creator?->avatar,
            ],
            'videos_count' => $pathway->videos->count(),
            'total_duration' => $this->formatDuration((int) $pathway->videos->sum('duration')),
            'progress_percentage' => $progress,
            'status' => $progress >= 100 ? 'completed' : ($progress > 0 ? 'active' : 'available'),
        ];

        if ($withVideos) {
            $payload['videos'] = $pathway->videos->map(fn ($video) => [
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'duration' => $video->duration,
                'thumbnail' => $video->thumbnail_url,
                'video_url' => $video->video_url,
            ])->values();
        }

        return $payload;
    }

    private function formatDuration(int $seconds): string
    {
        $hours = intdiv($seconds, 3600);
        $minutes = intdiv($seconds % 3600, 60);
        return trim(($hours > 0 ? $hours . 'h ' : '') . $minutes . 'min') ?: '0min';
    }
}
