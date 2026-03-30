<?php

namespace App\Http\Controllers\Pathway;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PathwayController extends Controller
{
    /**
     * Récupère les pathways pour un étudiant
     */
    public function index(Request $request): JsonResponse
    {
        $pathways = \App\Models\Pathway::with(['creator:id,name,avatar', 'videos'])
            ->where('is_active', true)
            ->get()
            ->map(function ($pathway) {
                return [
                    'id' => $pathway->id,
                    'title' => $pathway->title ?? 'Sans titre',
                    'description' => $pathway->description ?? 'Pas de description',
                    'thumbnail' => $pathway->thumbnail ?? '/default-pathway.jpg',
                    'created_at' => $pathway->created_at->toIso8601String(),
                    'creator' => $pathway->creator?->name,
                    'videos_count' => $pathway->videos->count(),
                    'video_ids' => $pathway->videos->pluck('id')->values(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $pathways
        ]);
    }

    /**
     * Récupère les pathways assignés à un employé
     */
    public function employeePathways(Request $request): JsonResponse
    {
        $employee = Auth::user();

        // Vérifier que c'est bien un employee
        if (!$employee instanceof Employee) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        // Récupérer les pathways assignés à cet employé
        $pathways = $employee->pathways()
            ->wherePivot('is_active', true)
            ->with(['creator:id,name,avatar', 'videos'])
            ->orderBy('assigned_at', 'desc')
            ->get()
            ->map(function ($pathway) {
                return [
                    'id' => $pathway->id,
                    'title' => $pathway->title ?? 'Sans titre',
                    'description' => $pathway->description ?? 'Pas de description',
                    'thumbnail' => $pathway->thumbnail ?? '/default-pathway.jpg',
                    'assigned_at' => $pathway->pivot->assigned_at->toIso8601String() ?? null,
                    'progress_percentage' => $pathway->pivot->progress_percentage ?? 0,
                    'completed_at' => $pathway->pivot->completed_at?->toIso8601String(),
                    'is_active' => $pathway->pivot->is_active ?? true,
                    'videos_count' => $pathway->videos->count(),
                    'video_ids' => $pathway->videos->pluck('id')->values(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $pathways
        ]);
    }
}
