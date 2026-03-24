<?php

namespace App\Http\Controllers;

use App\Models\Pathway;
use App\Models\EmployeePathway;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PathwayManagementController extends Controller
{
    /**
     * Créer un nouveau parcours de formation
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'domain' => 'required|string|max:255',
            'duration_hours' => 'required|integer|min:1',
            'difficulty_level' => 'required|string|in:beginner,intermediate,advanced',
            'video_ids' => 'required|array',
            'video_ids.*' => 'exists:videos,id',
        ]);

        $creatorId = Auth::id();

        $pathway = Pathway::create([
            'creator_id' => $creatorId,
            'title' => $request->title,
            'description' => $request->description,
            'domain' => $request->domain,
            'duration_hours' => $request->duration_hours,
            'difficulty_level' => $request->difficulty_level,
            'is_active' => true,
        ]);

        // Associer les vidéos au parcours
        $pathway->videos()->attach($request->video_ids);

        return response()->json([
            'success' => true,
            'data' => $pathway->load('videos'),
            'message' => 'Parcours de formation créé avec succès'
        ], 201);
    }

    /**
     * Assigner un parcours à un employé
     */
    public function assignToEmployee(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'pathway_id' => 'required|exists:pathways,id',
        ]);

        $creatorId = Auth::id();
        
        // Vérifier que l'employé appartient au créateur
        $employee = Employee::where('creator_id', $creatorId)
            ->where('id', $request->employee_id)
            ->firstOrFail();

        // Vérifier que le parcours appartient au créateur
        $pathway = Pathway::where('creator_id', $creatorId)
            ->where('id', $request->pathway_id)
            ->firstOrFail();

        // Vérifier si l'assignation existe déjà
        $existingAssignment = EmployeePathway::where('employee_id', $request->employee_id)
            ->where('pathway_id', $request->pathway_id)
            ->first();

        if ($existingAssignment) {
            return response()->json([
                'success' => false,
                'message' => 'Cet employé est déjà assigné à ce parcours'
            ], 409);
        }

        $assignment = EmployeePathway::create([
            'employee_id' => $request->employee_id,
            'pathway_id' => $request->pathway_id,
            'creator_id' => $creatorId,
            'progress_percentage' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $assignment->load(['employee', 'pathway']),
            'message' => 'Parcours assigné avec succès'
        ]);
    }

    /**
     * Obtenir les parcours disponibles pour un créateur
     */
    public function index(): JsonResponse
    {
        $creatorId = Auth::id();
        
        $pathways = Pathway::where('creator_id', $creatorId)
            ->with(['videos', 'employeePathways'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pathway) {
                return [
                    'id' => $pathway->id,
                    'title' => $pathway->title,
                    'description' => $pathway->description,
                    'domain' => $pathway->domain,
                    'duration_hours' => $pathway->duration_hours,
                    'difficulty_level' => $pathway->difficulty_level,
                    'is_active' => $pathway->is_active,
                    'videos_count' => $pathway->videos->count(),
                    'assigned_employees' => $pathway->employeePathways->count(),
                    'created_at' => $pathway->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $pathways
        ]);
    }

    /**
     * Obtenir les parcours assignés à un employé
     */
    public function employeePathways(string $employeeId): JsonResponse
    {
        $creatorId = Auth::id();
        
        // Vérifier que l'employé appartient au créateur
        $employee = Employee::where('creator_id', $creatorId)
            ->where('id', $employeeId)
            ->firstOrFail();

        $pathways = EmployeePathway::where('employee_id', $employeeId)
            ->where('is_active', true)
            ->with(['pathway.videos'])
            ->orderBy('assigned_at', 'desc')
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'pathway' => [
                        'id' => $assignment->pathway->id,
                        'title' => $assignment->pathway->title,
                        'description' => $assignment->pathway->description,
                        'domain' => $assignment->pathway->domain,
                        'duration_hours' => $assignment->pathway->duration_hours,
                        'difficulty_level' => $assignment->pathway->difficulty_level,
                        'videos' => $assignment->pathway->videos->map(function ($video) {
                            return [
                                'id' => $video->id,
                                'title' => $video->title,
                                'description' => $video->description,
                                'duration' => $video->duration,
                                'thumbnail' => $video->thumbnail_url,
                            ];
                        }),
                    ],
                    'assigned_at' => $assignment->assigned_at->format('Y-m-d H:i:s'),
                    'completed_at' => $assignment->completed_at? $assignment->completed_at->format('Y-m-d H:i:s') : null,
                    'progress_percentage' => $assignment->progress_percentage,
                    'is_completed' => $assignment->isCompleted(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => $employee,
                'pathways' => $pathways
            ]
        ]);
    }

    /**
     * Mettre à jour la progression d'un parcours employé
     */
    public function updateProgress(Request $request, string $assignmentId): JsonResponse
    {
        $request->validate([
            'progress_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $creatorId = Auth::id();
        
        $assignment = EmployeePathway::whereHas('pathway', function ($query) use ($creatorId) {
                $query->where('creator_id', $creatorId);
            })
            ->where('id', $assignmentId)
            ->firstOrFail();

        $assignment->updateProgress($request->progress_percentage);

        return response()->json([
            'success' => true,
            'data' => $assignment->fresh(),
            'message' => 'Progression mise à jour'
        ]);
    }

    /**
     * Supprimer une assignation de parcours
     */
    public function removeAssignment(string $assignmentId): JsonResponse
    {
        $creatorId = Auth::id();
        
        $assignment = EmployeePathway::whereHas('pathway', function ($query) use ($creatorId) {
                $query->where('creator_id', $creatorId);
            })
            ->where('id', $assignmentId)
            ->firstOrFail();

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignation supprimée avec succès'
        ]);
    }
}
