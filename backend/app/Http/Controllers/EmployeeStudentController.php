<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Video;
use App\Models\Pathway;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmployeeStudentController extends Controller
{
    /**
     * Obtenir le créateur associé à l'employé
     */
    private function getEmployeeCreator()
    {
        // Pour les employés avec Sanctum, on doit utiliser l'auth guard 'employee'
        $employee = Auth::guard('employee')->user();
        
        if (!$employee || !($employee instanceof Employee)) {
            abort(403, 'Accès non autorisé');
        }

        return $employee->creator;
    }

    /**
     * Liste des vidéos du créateur associé
     */
    public function videos(Request $request): JsonResponse
    {
        $creator = $this->getEmployeeCreator();
        
        if (!$creator) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun créateur associé'
            ], 404);
        }

        $query = Video::where('uploader_id', $creator->id)
                     ->where('visibility', 'public')
                     ->with(['creator', 'likes']);

        // Filtres
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 12);
        $videos = $query->paginate($perPage);

        // Transformer les données
        $transformedVideos = $videos->getCollection()->map(function ($video) {
            return [
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'category' => $video->category,
                'tags' => $video->tags ?? [],
                'learning_objectives' => $video->learning_objectives ?? [],
                'duration' => $video->duration,
                'creator' => [
                    'id' => $video->creator->id,
                    'name' => $video->creator->name,
                    'avatar' => $video->creator->avatar,
                ],
                'video_url' => $video->video_url,
                'thumbnail' => $video->thumbnail,
                'views' => $video->views ?? 0,
                'likes' => $video->likes->count() ?? 0,
                'created_at' => $video->created_at,
                'progress' => $this->getVideoProgress($video->id),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedVideos,
            'pagination' => [
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
                'per_page' => $videos->perPage(),
                'total' => $videos->total(),
            ],
            'creator_info' => [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
                'avatar' => $creator->avatar,
            ]
        ]);
    }

    /**
     * Liste des parcours du créateur associé
     */
    public function pathways(Request $request): JsonResponse
    {
        $creator = $this->getEmployeeCreator();
        
        if (!$creator) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun créateur associé'
            ], 404);
        }

        $employee = Auth::user();

        // Récupérer les parcours assignés à cet employé créés par son créateur
        $query = Pathway::where('creator_id', $creator->id)
                       ->whereHas('employees', function ($q) use ($employee) {
                           $q->where('employee_id', $employee->id);
                       })
                       ->with([
                           'creator',
                           'videos',
                           'employees' => function ($q) use ($employee) {
                               $q->where('employee_id', $employee->id)
                                 ->withPivot('assigned_at', 'completed_at', 'progress_percentage', 'is_active');
                           }
                       ]);

        // Filtres
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->whereHas('employees', function ($q) use ($employee) {
                    $q->where('employee_id', $employee->id)
                      ->where('is_active', true)
                      ->whereNull('completed_at');
                });
            } elseif ($status === 'completed') {
                $query->whereHas('employees', function ($q) use ($employee) {
                    $q->where('employee_id', $employee->id)
                      ->whereNotNull('completed_at');
                });
            }
        }

        // Tri
        $sortBy = $request->input('sort_by', 'assigned_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $pathways = $query->paginate($perPage);

        // Transformer les données
        $transformedPathways = $pathways->getCollection()->map(function ($pathway) {
            $employeePathway = $pathway->employees->first();
            
            return [
                'id' => $pathway->id,
                'title' => $pathway->title,
                'description' => $pathway->description,
                'creator' => [
                    'id' => $pathway->creator->id,
                    'name' => $pathway->creator->name,
                    'avatar' => $pathway->creator->avatar,
                ],
                'videos_count' => $pathway->videos->count(),
                'total_duration' => $this->calculateTotalDuration($pathway->videos),
                'assigned_at' => $employeePathway->pivot->assigned_at,
                'completed_at' => $employeePathway->pivot->completed_at,
                'progress_percentage' => $employeePathway->pivot->progress_percentage ?? 0,
                'is_active' => $employeePathway->pivot->is_active,
                'status' => $this->getParcourStatus($employeePathway->pivot),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedPathways,
            'pagination' => [
                'current_page' => $pathways->currentPage(),
                'last_page' => $pathways->lastPage(),
                'per_page' => $pathways->perPage(),
                'total' => $pathways->total(),
            ],
            'creator_info' => [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
                'avatar' => $creator->avatar,
            ]
        ]);
    }

    /**
     * Détails d'un parcours spécifique
     */
    public function pathwayDetails($id): JsonResponse
    {
        $creator = $this->getEmployeeCreator();
        $employee = Auth::user();

        $pathway = Pathway::where('id', $id)
                         ->where('creator_id', $creator->id)
                         ->whereHas('employees', function ($q) use ($employee) {
                             $q->where('employee_id', $employee->id);
                         })
                         ->with([
                             'creator',
                             'videos',
                             'employees' => function ($q) use ($employee) {
                                 $q->where('employee_id', $employee->id)
                                   ->withPivot('assigned_at', 'completed_at', 'progress_percentage', 'is_active');
                             }
                         ])
                         ->firstOrFail();

        // Récupérer la progression pour chaque vidéo
        $videosWithProgress = $pathway->videos->map(function ($video) use ($employee) {
            return [
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'category' => $video->category,
                'duration' => $video->duration,
                'video_url' => $video->video_url,
                'thumbnail' => $video->thumbnail,
                'views' => $video->views ?? 0,
                'order' => $video->pivot->order ?? 0,
                'progress' => $this->getVideoProgress($video->id),
                'is_completed' => $this->isVideoCompleted($video->id),
            ];
        })->sortBy('order')->values();

        $employeePathway = $pathway->employees->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $pathway->id,
                'title' => $pathway->title,
                'description' => $pathway->description,
                'creator' => [
                    'id' => $pathway->creator->id,
                    'name' => $pathway->creator->name,
                    'avatar' => $pathway->creator->avatar,
                ],
                'videos' => $videosWithProgress,
                'assigned_at' => $employeePathway->pivot->assigned_at,
                'completed_at' => $employeePathway->pivot->completed_at,
                'progress_percentage' => $employeePathway->pivot->progress_percentage ?? 0,
                'is_active' => $employeePathway->pivot->is_active,
                'status' => $this->getParcourStatus($employeePathway->pivot),
                'stats' => [
                    'total_videos' => $pathway->videos->count(),
                    'completed_videos' => $videosWithProgress->where('is_completed', true)->count(),
                    'total_duration' => $this->calculateTotalDuration($pathway->videos),
                    'estimated_completion_time' => $this->calculateEstimatedCompletion($pathway->videos),
                ]
            ]
        ]);
    }

    /**
     * Marquer une vidéo comme complétée
     */
    public function completeVideo(Request $request, $videoId): JsonResponse
    {
        $request->validate([
            'watched_duration' => 'required|integer|min:0',
            'completed' => 'required|boolean',
        ]);

        $creator = $this->getEmployeeCreator();
        $employee = Auth::user();

        // Vérifier que la vidéo appartient au créateur
        $video = Video::where('id', $videoId)
                     ->where('uploader_id', $creator->id)
                     ->firstOrFail();

        // Mettre à jour ou créer la progression
        $progress = EmployeeProgress::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'video_id' => $videoId,
            ],
            [
                'watched_duration' => $request->watched_duration,
                'is_completed' => $request->completed,
                'completed_at' => $request->completed ? now() : null,
                'last_watched_at' => now(),
            ]
        );

        // Mettre à jour la progression des parcours si nécessaire
        $this->updatePathwayProgress($employee->id);

        return response()->json([
            'success' => true,
            'message' => $request->completed ? 'Vidéo marquée comme complétée' : 'Progression mise à jour',
            'data' => $progress
        ]);
    }

    /**
     * Obtenir la progression d'une vidéo
     */
    private function getVideoProgress($videoId): array
    {
        $employee = Auth::user();
        
        $progress = EmployeeProgress::where('employee_id', $employee->id)
                                  ->where('video_id', $videoId)
                                  ->first();

        if (!$progress) {
            return [
                'watched_duration' => 0,
                'is_completed' => false,
                'completed_at' => null,
                'last_watched_at' => null,
            ];
        }

        return [
            'watched_duration' => $progress->watched_duration,
            'is_completed' => $progress->is_completed,
            'completed_at' => $progress->completed_at,
            'last_watched_at' => $progress->last_watched_at,
        ];
    }

    /**
     * Vérifier si une vidéo est complétée
     */
    private function isVideoCompleted($videoId): bool
    {
        $employee = Auth::user();
        
        return EmployeeProgress::where('employee_id', $employee->id)
                              ->where('video_id', $videoId)
                              ->where('is_completed', true)
                              ->exists();
    }

    /**
     * Calculer la durée totale des vidéos
     */
    private function calculateTotalDuration($videos): string
    {
        $totalSeconds = 0;
        
        foreach ($videos as $video) {
            $duration = $video->duration;
            if (preg_match('/(\d+):(\d+)/', $duration, $matches)) {
                $totalSeconds += $matches[1] * 60 + $matches[2];
            }
        }

        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        
        if ($hours > 0) {
            return "{$hours}h {$minutes}min";
        }
        
        return "{$minutes}min";
    }

    /**
     * Obtenir le statut d'un parcours
     */
    private function getParcourStatus($pivot): string
    {
        if ($pivot->completed_at) {
            return 'completed';
        }
        
        if (!$pivot->is_active) {
            return 'inactive';
        }
        
        return 'active';
    }

    /**
     * Calculer le temps de complétion estimé
     */
    private function calculateEstimatedCompletion($videos): string
    {
        $totalSeconds = 0;
        
        foreach ($videos as $video) {
            $duration = $video->duration;
            if (preg_match('/(\d+):(\d+)/', $duration, $matches)) {
                $totalSeconds += $matches[1] * 60 + $matches[2];
            }
        }

        // Estimer 1.5x la durée réelle (temps pour regarder et pratiquer)
        $estimatedSeconds = $totalSeconds * 1.5;
        
        $hours = floor($estimatedSeconds / 3600);
        $minutes = floor(($estimatedSeconds % 3600) / 60);
        
        if ($hours > 0) {
            return "~{$hours}h {$minutes}min";
        }
        
        return "~{$minutes}min";
    }

    /**
     * Mettre à jour la progression des parcours
     */
    private function updatePathwayProgress($employeeId): void
    {
        // Récupérer tous les parcours actifs de l'employé
        $pathways = Pathway::whereHas('employees', function ($q) use ($employeeId) {
            $q->where('employee_id', $employeeId)
              ->where('is_active', true)
              ->whereNull('completed_at');
        })->with('videos')->get();

        foreach ($pathways as $pathway) {
            $totalVideos = $pathway->videos->count();
            $completedVideos = EmployeeProgress::where('employee_id', $employeeId)
                                            ->whereIn('video_id', $pathway->videos->pluck('id'))
                                            ->where('is_completed', true)
                                            ->count();

            $progressPercentage = $totalVideos > 0 ? ($completedVideos / $totalVideos) * 100 : 0;

            // Mettre à jour la progression du parcours
            $pathway->employees()->updateExistingPivot($employeeId, [
                'progress_percentage' => $progressPercentage,
                'completed_at' => $progressPercentage >= 100 ? now() : null,
            ]);
        }
    }

    /**
     * Dashboard de l'employé (vue student)
     */
    public function dashboard(): JsonResponse
    {
        $creator = $this->getEmployeeCreator();
        $employee = Auth::user();

        if (!$creator) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun créateur associé'
            ], 404);
        }

        // Statistiques générales
        $totalVideos = Video::where('uploader_id', $creator->id)
                           ->where('visibility', 'public')
                           ->count();

        $totalPathways = Pathway::where('creator_id', $creator->id)
                               ->whereHas('employees', function ($q) use ($employee) {
                                   if ($employee) {
                                       $q->where('employee_id', $employee->id);
                                   }
                               })
                               ->count();

        $completedVideos = EmployeeProgress::where('employee_id', $employee ? $employee->id : null)
                                         ->where('completed', true)
                                         ->count();

        $completedPathways = Pathway::where('creator_id', $creator->id)
                                   ->whereHas('employees', function ($q) use ($employee) {
                                       if ($employee) {
                                           $q->where('employee_id', $employee->id)
                                             ->whereNotNull('completed_at');
                                       }
                                   })
                                   ->count();

        // Activité récente
        $recentActivity = EmployeeProgress::where('employee_id', $employee ? $employee->id : null)
                                        ->whereNotNull('last_watched_at')
                                        ->with('video')
                                        ->orderBy('last_watched_at', 'desc')
                                        ->take(5)
                                        ->get()
                                        ->map(function ($progress) {
                                            return [
                                                'video' => [
                                                    'id' => $progress->video->id,
                                                    'title' => $progress->video->title,
                                                    'thumbnail' => $progress->video->thumbnail,
                                                ],
                                                'watched_duration' => $progress->watch_time_seconds,
                                                'is_completed' => $progress->completed,
                                                'last_watched_at' => $progress->last_watched_at,
                                            ];
                                        });

        return response()->json([
            'success' => true,
            'data' => [
                'creator_info' => [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                    'avatar' => $creator->avatar,
                ],
                'stats' => [
                    'total_videos' => $totalVideos,
                    'total_pathways' => $totalPathways,
                    'completed_videos' => $completedVideos,
                    'completed_pathways' => $completedPathways,
                    'video_completion_rate' => $totalVideos > 0 ? round(($completedVideos / $totalVideos) * 100, 2) : 0,
                    'pathway_completion_rate' => $totalPathways > 0 ? round(($completedPathways / $totalPathways) * 100, 2) : 0,
                ],
                'recent_activity' => $recentActivity,
            ]
        ]);
    }

    /**
     * Récupérer les données de progression de l'employé
     */
    public function getProgress(Request $request)
    {
        try {
            $employee = $this->getAuthenticatedEmployee();
            $creator = $this->getEmployeeCreator();
            
            if (!$creator) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun créateur associé'
                ], 404);
            }

            $period = $request->get('period', 'daily');
            
            // Données de progression mockées (à remplacer avec de vraies données)
            $progressData = [
                'daily' => [
                    ['date' => now()->subDays(6)->format('Y-m-d'), 'videos' => 2, 'pathways' => 1],
                    ['date' => now()->subDays(5)->format('Y-m-d'), 'videos' => 3, 'pathways' => 0],
                    ['date' => now()->subDays(4)->format('Y-m-d'), 'videos' => 1, 'pathways' => 2],
                    ['date' => now()->subDays(3)->format('Y-m-d'), 'videos' => 4, 'pathways' => 1],
                    ['date' => now()->subDays(2)->format('Y-m-d'), 'videos' => 2, 'pathways' => 0],
                    ['date' => now()->subDays(1)->format('Y-m-d'), 'videos' => 5, 'pathways' => 3],
                    ['date' => now()->format('Y-m-d'), 'videos' => 3, 'pathways' => 1],
                ],
                'weekly' => [
                    ['week' => 'Semaine 1', 'completion' => 65],
                    ['week' => 'Semaine 2', 'completion' => 72],
                    ['week' => 'Semaine 3', 'completion' => 78],
                    ['week' => 'Semaine 4', 'completion' => 85],
                ],
                'monthly' => [
                    ['month' => 'Janvier', 'hours' => 12],
                    ['month' => 'Février', 'hours' => 18],
                    ['month' => 'Mars', 'hours' => 24],
                    ['month' => 'Avril', 'hours' => 15],
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $progressData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la progression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir l'employé authentifié
     */
    private function getAuthenticatedEmployee()
    {
        // Pour les employés avec Sanctum, on doit utiliser l'auth guard 'employee'
        $employee = Auth::guard('employee')->user();
        
        if (!$employee || !($employee instanceof Employee)) {
            abort(403, 'Accès non autorisé');
        }

        return $employee;
    }
}
