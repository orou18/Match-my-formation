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
                    'domain' => $pathway->domain,
                    'duration_hours' => $pathway->duration_hours,
                    'difficulty_level' => $pathway->difficulty_level,
                    'videos_count' => $pathway->videos->count(),
                    'video_ids' => $pathway->videos->pluck('id')->values(),
                    'videos' => $pathway->videos->values()->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'title' => $video->title,
                            'description' => $video->description,
                            'duration' => $video->duration,
                            'thumbnail' => $video->thumbnail_url,
                            'video_url' => $video->video_url,
                            'visibility' => $video->visibility,
                            'sort_order' => $video->pivot?->sort_order,
                        ];
                    })->all(),
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
                    'domain' => $pathway->domain,
                    'duration_hours' => $pathway->duration_hours,
                    'difficulty_level' => $pathway->difficulty_level,
                    'videos_count' => $pathway->videos->count(),
                    'video_ids' => $pathway->videos->pluck('id')->values(),
                    'videos' => $pathway->videos->values()->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'title' => $video->title,
                            'description' => $video->description,
                            'duration' => $video->duration,
                            'thumbnail' => $video->thumbnail_url,
                            'video_url' => $video->video_url,
                            'visibility' => $video->visibility,
                            'sort_order' => $video->pivot?->sort_order,
                        ];
                    })->all(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $pathways
        ]);
    }

    /**
     * Récupère les détails de progression d'un étudiant pour ses parcours
     */
    public function studentProgressDetails(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Pour l'instant, on utilise la même logique que employeePathways
        // Plus tard, on pourra différencier selon le type d'utilisateur
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Si c'est un employé, récupérer ses pathways
        if ($user instanceof Employee) {
            $pathways = $user->pathways()
                ->wherePivot('is_active', true)
                ->with(['creator:id,name,avatar', 'videos'])
                ->orderBy('assigned_at', 'desc')
                ->get();
        } else {
            // Si c'est un user normal, récupérer tous les pathways actifs
            $pathways = \App\Models\Pathway::with(['creator:id,name,avatar', 'videos'])
                ->where('is_active', true)
                ->get();
        }

        // Calculer les statistiques globales
        $totalPathways = $pathways->count();
        $completedPathways = $pathways->filter(function ($pathway) use ($user) {
            if ($user instanceof Employee) {
                $progress = $pathway->pivot->progress_percentage ?? 0;
            } else {
                // Pour les users normaux, progress simulé (à améliorer)
                $progress = 0;
            }
            return $progress >= 90;
        })->count();
        
        $inProgressPathways = $totalPathways - $completedPathways;
        $totalHours = $pathways->sum('duration_hours');
        
        // Calculer les heures complétées
        $completedHours = 0;
        if ($user instanceof Employee) {
            $completedHours = $pathways->sum(function ($pathway) {
                $progress = $pathway->pivot->progress_percentage ?? 0;
                return ($progress / 100) * $pathway->duration_hours;
            });
        }

        // Transformer les pathways pour le frontend
        $coursesInProgress = $pathways->map(function ($pathway) use ($user) {
            $progress = 0;
            $completedModules = 0;
            
            if ($user instanceof Employee) {
                $progress = $pathway->pivot->progress_percentage ?? 0;
                $completedModules = Math.floor(($progress / 100) * $pathway->videos->count());
            }
            
            return [
                'id' => $pathway->id,
                'title' => $pathway->title ?? 'Sans titre',
                'module' => "Module " . $completedModules . " sur " . $pathway->videos->count() . " terminé",
                'progress' => $progress,
                'image' => $pathway->thumbnail ?? '/default-pathway.jpg',
                'totalModules' => $pathway->videos->count(),
                'completedModules' => $completedModules,
                'estimatedTime' => ($pathway->duration_hours ?? 8) . "h",
                'difficulty' => $pathway->difficulty_level ?? 'Débutant',
                'instructor' => [
                    'name' => $pathway->creator?->name ?? 'Créateur',
                    'avatar' => $pathway->creator?->avatar ?? '/avatars/default-creator.jpg',
                    'specialty' => $pathway->domain ?? 'Formation',
                ],
                'nextModule' => $pathway->videos->first() ? [
                    'title' => $pathway->videos->first()->title ?? 'Prochain module',
                    'duration' => $pathway->videos->first()->duration ?? '1h',
                    'type' => 'video',
                ] : null,
            ];
        });

        // Modules récents (simulés pour l'instant)
        $recentModules = $pathways->take(3)->map(function ($pathway, $index) {
            return [
                'id' => time() + $index,
                'title' => $pathway->videos->first()?->title ?? 'Module ' . ($index + 1),
                'course' => $pathway->title,
                'date' => now()->subDays($index)->format('d F Y'),
                'duration' => $pathway->videos->first()?->duration ?? '1h',
                'type' => 'video',
                'completed' => $index < 2, // Simulation
                'score' => rand(80, 95),
                'certificate' => [
                    'earned' => $index < 1, // Simulation
                    'downloadUrl' => $index < 1 ? '/certificates/generated.pdf' : null,
                ],
            ];
        });

        // Certifications
        $certifications = $pathways
            ->filter(function ($pathway) use ($user) {
                if ($user instanceof Employee) {
                    $progress = $pathway->pivot->progress_percentage ?? 0;
                } else {
                    $progress = 0;
                }
                return $progress >= 90;
            })
            ->map(function ($pathway, $index) {
                return [
                    'id' => $pathway->id,
                    'title' => "Certification " . $pathway->title,
                    'description' => "Formation complète sur " . $pathway->title,
                    'date' => now()->format('d F Y'),
                    'progress' => 100,
                    'status' => 'Obtenu',
                    'score' => rand(85, 95),
                    'downloadUrl' => '/certificates/generated.pdf',
                    'issuer' => 'MatchMyFormation',
                    'credentialId' => 'MTF-' . $pathway->id . '-2024-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'expiresAt' => null,
                    'skills' => [$pathway->domain, 'Communication', 'Gestion', 'Leadership'],
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'coursesInProgress' => $coursesInProgress->values(),
                'recentModules' => $recentModules->values(),
                'certifications' => $certifications->values(),
                'globalStats' => [
                    'totalCourses' => $totalPathways,
                    'completedCourses' => $completedPathways,
                    'inProgressCourses' => $inProgressPathways,
                    'totalHours' => $totalHours,
                    'completedHours' => round($completedHours, 1),
                    'averageScore' => $totalPathways > 0 ? 85 : 0,
                    'streak' => 7,
                    'rank' => 12,
                    'totalStudents' => 1250,
                ],
            ]
        ]);
    }
}
