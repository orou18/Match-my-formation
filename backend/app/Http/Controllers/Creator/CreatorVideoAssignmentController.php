<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Video;
use Illuminate\Http\Request;

class CreatorVideoAssignmentController extends Controller
{
    public function assign(Request $request, $videoId)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        $video = Video::where('uploader_id', $creator->id)->findOrFail($videoId);
        $validated = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'integer|exists:employees,id',
        ]);

        $employees = Employee::where('creator_id', $creator->id)
            ->whereIn('id', $validated['employee_ids'])
            ->pluck('id');

        $sync = $employees->mapWithKeys(fn ($employeeId) => [
            $employeeId => [
                'creator_id' => $creator->id,
                'assigned_at' => now(),
                'is_active' => true,
            ],
        ])->all();

        $video->assignedEmployees()->syncWithoutDetaching($sync);

        return response()->json([
            'success' => true,
            'message' => 'Vidéo assignée aux employés sélectionnés',
            'data' => $video->load('assignedEmployees:id,name,email'),
        ]);
    }

    public function unassign(Request $request, $videoId)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        $video = Video::where('uploader_id', $creator->id)->findOrFail($videoId);
        $validated = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'integer|exists:employees,id',
        ]);

        $video->assignedEmployees()->updateExistingPivot($validated['employee_ids'], [
            'is_active' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Assignations vidéo désactivées',
        ]);
    }
}
