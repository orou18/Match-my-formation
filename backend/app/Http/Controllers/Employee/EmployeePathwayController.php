<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\Pathway;
use App\Models\PathwayProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeePathwayController extends Controller
{
    /**
     * Obtenir les parcours assignés à l'employé
     */
    public function getPathways(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            // Récupérer les pathways assignés via le créateur
            $pathways = Pathway::with(['creator:id,name,email,avatar', 'videos'])
                ->where('creator_id', $employee->creator_id)
                ->where('is_published', true)
                ->get()
                ->map(function($pathway) use ($employee) {
                    // Récupérer la progression de l'employé pour ce pathway
                    $pathwayProgress = PathwayProgress::where('employee_id', $employee->id)
                        ->where('pathway_id', $pathway->id)
                        ->first();

                    $completedVideos = EmployeeProgress::where('employee_id', $employee->id)
                        ->whereIn('video_id', $pathway->videos->pluck('id'))
                        ->where('progress', '>=', 100)
                        ->distinct('video_id')
                        ->count();

                    $totalVideos = $pathway->videos->count();
                    $progressPercentage = $totalVideos > 0 ? ($completedVideos / $totalVideos) * 100 : 0;

                    return [
                        'id' => $pathway->id,
                        'title' => $pathway->title,
                        'description' => $pathway->description,
                        'creator' => [
                            'id' => $pathway->creator->id,
                            'name' => $pathway->creator->name,
                            'avatar' => $pathway->creator->avatar ?? '/default-avatar.png',
                        ],
                        'videos_count' => $totalVideos,
                        'total_duration' => $this->calculateTotalDuration($pathway->videos),
                        'assigned_at' => $pathwayProgress ? $pathwayProgress->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'completed_at' => $pathwayProgress ? $pathwayProgress->completed_at?->format('Y-m-d') : null,
                        'progress_percentage' => round($progressPercentage, 1),
                        'is_active' => $progressPercentage < 100,
                        'status' => $progressPercentage >= 100 ? 'completed' : ($progressPercentage > 0 ? 'active' : 'inactive'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $pathways->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les détails d'un pathway spécifique
     */
    public function getPathwayDetails(Request $request, $pathwayId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            $pathway = Pathway::with(['creator:id,name,email,avatar', 'videos'])
                ->where('id', $pathwayId)
                ->where('creator_id', $employee->creator_id)
                ->where('is_published', true)
                ->first();

            if (!$pathway) {
                return response()->json(['error' => 'Parcours non trouvé'], 404);
            }

            // Récupérer la progression détaillée
            $videosWithProgress = $pathway->videos->map(function($video) use ($employee) {
                $progress = EmployeeProgress::where('employee_id', $employee->id)
                    ->where('video_id', $video->id)
                    ->first();

                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'category' => $video->category,
                    'tags' => $video->tags ?? [],
                    'learning_objectives' => $video->learning_objectives ?? [],
                    'duration' => $video->duration,
                    'creator' => [
                        'id' => $pathway->creator->id,
                        'name' => $pathway->creator->name,
                        'avatar' => $pathway->creator->avatar ?? '/default-avatar.png',
                    ],
                    'video_url' => $video->video_url,
                    'thumbnail' => $video->thumbnail,
                    'views' => $video->views,
                    'likes' => $video->likes,
                    'created_at' => $video->created_at->format('Y-m-d'),
                    'progress' => [
                        'watched_duration' => $progress ? $progress->watch_time : 0,
                        'is_completed' => $progress ? $progress->progress >= 100 : false,
                        'completed_at' => $progress && $progress->progress >= 100 ? $progress->completed_at?->format('Y-m-d') : null,
                        'last_watched_at' => $progress ? $progress->last_watched_at?->format('Y-m-d H:i:s') : null,
                        'progress_percentage' => $progress ? $progress->progress : 0,
                    ],
                ];
            });

            $completedVideos = EmployeeProgress::where('employee_id', $employee->id)
                ->whereIn('video_id', $pathway->videos->pluck('id'))
                ->where('progress', '>=', 100)
                ->distinct('video_id')
                ->count();

            $pathwayProgress = PathwayProgress::where('employee_id', $employee->id)
                ->where('pathway_id', $pathwayId)
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $pathway->id,
                    'title' => $pathway->title,
                    'description' => $pathway->description,
                    'creator' => [
                        'id' => $pathway->creator->id,
                        'name' => $pathway->creator->name,
                        'avatar' => $pathway->creator->avatar ?? '/default-avatar.png',
                    ],
                    'videos' => $videosWithProgress->toArray(),
                    'stats' => [
                        'total_videos' => $pathway->videos->count(),
                        'completed_videos' => $completedVideos,
                        'progress_percentage' => $pathway->videos->count() > 0 ? round(($completedVideos / $pathway->videos->count()) * 100, 1) : 0,
                        'total_duration' => $this->calculateTotalDuration($pathway->videos),
                        'estimated_completion_time' => $this->estimateCompletionTime($pathway->videos, $completedVideos),
                    ],
                    'assigned_at' => $pathwayProgress ? $pathwayProgress->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'completed_at' => $pathwayProgress ? $pathwayProgress->completed_at?->format('Y-m-d') : null,
                    'status' => $completedVideos >= $pathway->videos->count() ? 'completed' : 'active',
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
     * Démarrer un pathway
     */
    public function startPathway(Request $request, $pathwayId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            $pathway = Pathway::where('id', $pathwayId)
                ->where('creator_id', $employee->creator_id)
                ->where('is_published', true)
                ->first();

            if (!$pathway) {
                return response()->json(['error' => 'Parcours non trouvé'], 404);
            }

            // Créer ou mettre à jour la progression du pathway
            $pathwayProgress = PathwayProgress::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'pathway_id' => $pathwayId,
                ],
                [
                    'started_at' => now(),
                    'status' => 'active',
                    'updated_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Parcours démarré avec succès',
                'data' => [
                    'pathway_id' => $pathwayId,
                    'started_at' => $pathwayProgress->started_at,
                    'status' => 'active',
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
     * Mettre à jour la progression d'un pathway
     */
    public function updatePathwayProgress(Request $request, $pathwayId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            $pathway = Pathway::where('id', $pathwayId)
                ->where('creator_id', $employee->creator_id)
                ->first();

            if (!$pathway) {
                return response()->json(['error' => 'Parcours non trouvé'], 404);
            }

            $validated = $request->validate([
                'current_video_id' => 'required|integer',
                'overall_progress' => 'required|integer|min:0|max:100',
            ]);

            // Mettre à jour la progression du pathway
            $pathwayProgress = PathwayProgress::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'pathway_id' => $pathwayId,
                ],
                [
                    'current_video_id' => $validated['current_video_id'],
                    'overall_progress' => $validated['overall_progress'],
                    'status' => $validated['overall_progress'] >= 100 ? 'completed' : 'active',
                    'completed_at' => $validated['overall_progress'] >= 100 ? now() : null,
                    'updated_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Progression du parcours mise à jour',
                'data' => [
                    'overall_progress' => $pathwayProgress->overall_progress,
                    'status' => $pathwayProgress->status,
                    'completed_at' => $pathwayProgress->completed_at,
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
     * Obtenir les pathways disponibles
     */
    public function getAvailablePathways(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::where('user_id', $user->id)->first();
            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            // Pathways disponibles du créateur
            $availablePathways = Pathway::with(['creator:id,name,email,avatar'])
                ->where('creator_id', $employee->creator_id)
                ->where('is_published', true)
                ->whereDoesntHave('pathwayProgress', function($query) use ($employee) {
                    $query->where('employee_id', $employee->id)
                          ->where('status', '!=', 'completed');
                })
                ->get()
                ->map(function($pathway) {
                    return [
                        'id' => $pathway->id,
                        'title' => $pathway->title,
                        'description' => $pathway->description,
                        'duration' => $pathway->estimated_duration ?? 'Non spécifiée',
                        'difficulty' => $pathway->difficulty ?? 'Intermédiaire',
                        'videos_count' => $pathway->videos_count ?? 0,
                        'creator' => [
                            'id' => $pathway->creator->id,
                            'name' => $pathway->creator->name,
                            'avatar' => $pathway->creator->avatar ?? '/default-avatar.png',
                        ],
                        'created_at' => $pathway->created_at->format('Y-m-d'),
                        'is_enrolled' => false,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $availablePathways->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculer la durée totale d'un ensemble de vidéos
     */
    private function calculateTotalDuration($videos)
    {
        $totalSeconds = 0;
        
        foreach ($videos as $video) {
            if ($video->duration) {
                $parts = explode(':', $video->duration);
                if (count($parts) >= 2) {
                    $totalSeconds += intval($parts[0]) * 60 + intval($parts[1]);
                }
            }
        }

        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        
        if ($hours > 0) {
            return "{$hours}h {$minutes}min";
        } else {
            return "{$minutes}min";
        }
    }

    /**
     * Estimer le temps de complétion
     */
    private function estimateCompletionTime($videos, $completedVideos)
    {
        $remainingVideos = count($videos) - $completedVideos;
        if ($remainingVideos <= 0) {
            return 'Terminé';
        }

        // Estimer 30 minutes par vidéo restante
        $estimatedMinutes = $remainingVideos * 30;
        $hours = floor($estimatedMinutes / 60);
        $minutes = $estimatedMinutes % 60;

        if ($hours > 0) {
            return "~{$hours}h {$minutes}min";
        } else {
            return "~{$minutes}min";
        }
    }
}
