<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\Pathway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeeDashboardController extends Controller
{
    /**
     * Obtenir les informations de l'employé connecté
     */
    public function getMe(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'employee') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $employee = Employee::with(['creator:id,name,email,avatar'])
                ->where('user_id', $user->id)
                ->first();

            if (!$employee) {
                return response()->json(['error' => 'Employé non trouvé'], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'avatar' => $employee->avatar ?? '/default-avatar.png',
                    'role' => $employee->role ?? 'employee',
                    'creator_id' => $employee->creator_id,
                    'creator' => $employee->creator,
                    'created_at' => $employee->created_at->toISOString(),
                    'last_login' => $employee->updated_at->toISOString(),
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
     * Obtenir les cours assignés à l'employé
     */
    public function getCourses(Request $request)
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

            // Récupérer les vidéos assignées via le créateur
            $courses = Video::with(['creator:id,name,email,avatar'])
                ->where('uploader_id', $employee->creator_id)
                ->where('is_published', true)
                ->where(function($query) use ($employee) {
                    $query->where('visibility', 'public')
                          ->orWhere('visibility', 'private');
                })
                ->get()
                ->map(function($video) use ($employee) {
                    // Récupérer la progression de l'employé pour cette vidéo
                    $progress = EmployeeProgress::where('employee_id', $employee->id)
                        ->where('video_id', $video->id)
                        ->first();

                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail,
                        'video_url' => $video->video_url,
                        'duration' => $video->duration,
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'comments' => $video->comments ?? 0,
                        'publishedAt' => $video->created_at->format('Y-m-d'),
                        'visibility' => $video->visibility,
                        'status' => $progress && $progress->progress >= 100 ? 'completed' : 'in_progress',
                        'progress' => $progress ? $progress->progress : 0,
                        'completed' => $progress ? $progress->progress >= 100 : false,
                        'creator' => [
                            'name' => $video->creator->name,
                            'domain' => $video->creator->email ? explode('@', $video->creator->email)[1] : 'example.com',
                        ],
                        'last_watched_at' => $progress ? $progress->last_watched_at : null,
                        'watch_time' => $progress ? $progress->watch_time : 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $courses->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques de l'employé
     */
    public function getStats(Request $request)
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

            // Statistiques des vidéos
            $totalVideos = Video::where('uploader_id', $employee->creator_id)
                ->where('is_published', true)
                ->count();

            $completedVideos = EmployeeProgress::where('employee_id', $employee->id)
                ->where('progress', '>=', 100)
                ->distinct('video_id')
                ->count();

            $inProgressVideos = EmployeeProgress::where('employee_id', $employee->id)
                ->where('progress', '<', 100)
                ->where('progress', '>', 0)
                ->distinct('video_id')
                ->count();

            $totalWatchTime = EmployeeProgress::where('employee_id', $employee->id)
                ->sum('watch_time');

            // Certifications (basées sur vidéos complétées)
            $certificatesEarned = $this->calculateCertificates($employee->id);

            $stats = [
                'total_courses' => $totalVideos,
                'completed_courses' => $completedVideos,
                'in_progress_courses' => $inProgressVideos,
                'total_watch_time' => round($totalWatchTime / 3600, 2), // En heures
                'certificates_earned' => $certificatesEarned,
                'completion_rate' => $totalVideos > 0 ? round(($completedVideos / $totalVideos) * 100, 1) : 0,
                'average_score' => $this->calculateAverageScore($employee->id),
                'streak_days' => $this->calculateStreak($employee->id),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir l'activité récente de l'employé
     */
    public function getRecentActivity(Request $request)
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

            $recentActivity = EmployeeProgress::with(['video:id,title,thumbnail'])
                ->where('employee_id', $employee->id)
                ->where('last_watched_at', '>=', now()->subDays(30))
                ->orderBy('last_watched_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($progress) {
                    return [
                        'video' => [
                            'id' => $progress->video->id,
                            'title' => $progress->video->title,
                            'thumbnail' => $progress->video->thumbnail,
                        ],
                        'watched_duration' => $progress->watch_time,
                        'is_completed' => $progress->progress >= 100,
                        'last_watched_at' => $progress->last_watched_at->toISOString(),
                        'progress_percentage' => $progress->progress,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentActivity->toArray()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour la progression d'une vidéo
     */
    public function updateProgress(Request $request, $videoId)
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

            // Vérifier que la vidéo existe et est accessible
            $video = Video::where('id', $videoId)
                ->where('uploader_id', $employee->creator_id)
                ->first();

            if (!$video) {
                return response()->json(['error' => 'Vidéo non trouvée ou non accessible'], 404);
            }

            $validated = $request->validate([
                'progress' => 'required|integer|min:0|max:100',
                'watch_time' => 'required|integer|min:0',
                'current_time' => 'nullable|integer|min:0',
            ]);

            // Mettre à jour ou créer la progression
            $progress = EmployeeProgress::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'video_id' => $videoId,
                ],
                [
                    'progress' => $validated['progress'],
                    'watch_time' => $validated['watch_time'],
                    'current_time' => $validated['current_time'] ?? 0,
                    'last_watched_at' => now(),
                    'completed_at' => $validated['progress'] >= 100 ? now() : null,
                ]
            );

            // Incrémenter les vues de la vidéo si c'est la première fois
            if (!$progress->wasRecentlyCreated) {
                $video->increment('views');
            }

            return response()->json([
                'success' => true,
                'message' => 'Progression mise à jour avec succès',
                'data' => [
                    'progress' => $progress->progress,
                    'watch_time' => $progress->watch_time,
                    'is_completed' => $progress->progress >= 100,
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
     * Marquer une vidéo comme terminée
     */
    public function completeVideo(Request $request, $videoId)
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

            $video = Video::where('id', $videoId)
                ->where('uploader_id', $employee->creator_id)
                ->first();

            if (!$video) {
                return response()->json(['error' => 'Vidéo non trouvée ou non accessible'], 404);
            }

            $progress = EmployeeProgress::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'video_id' => $videoId,
                ],
                [
                    'progress' => 100,
                    'completed_at' => now(),
                    'last_watched_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Vidéo marquée comme terminée',
                'data' => [
                    'completed_at' => $progress->completed_at,
                    'certificate_earned' => $this->checkCertificateEligibility($employee->id),
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
     * Calculer le nombre de certificats
     */
    private function calculateCertificates($employeeId)
    {
        $completedVideos = EmployeeProgress::where('employee_id', $employeeId)
            ->where('progress', '>=', 100)
            ->distinct('video_id')
            ->count();

        // Règles de certificats
        $certificates = 0;
        if ($completedVideos >= 5) $certificates++;
        if ($completedVideos >= 10) $certificates++;
        if ($completedVideos >= 25) $certificates++;
        if ($completedVideos >= 50) $certificates++;

        return $certificates;
    }

    /**
     * Calculer le score moyen
     */
    private function calculateAverageScore($employeeId)
    {
        return EmployeeProgress::where('employee_id', $employeeId)
            ->where('score', '>', 0)
            ->avg('score') ?? 0;
    }

    /**
     * Calculer le streak de jours
     */
    private function calculateStreak($employeeId)
    {
        $streak = 0;
        $currentDate = now();

        for ($i = 0; $i < 365; $i++) {
            $hasActivity = EmployeeProgress::where('employee_id', $employeeId)
                ->whereDate('last_watched_at', $currentDate->format('Y-m-d'))
                ->exists();

            if ($hasActivity) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Vérifier l'éligibilité au certificat
     */
    private function checkCertificateEligibility($employeeId)
    {
        $completedVideos = EmployeeProgress::where('employee_id', $employeeId)
            ->where('progress', '>=', 100)
            ->distinct('video_id')
            ->count();

        return $completedVideos >= 5; // Premier certificat à 5 vidéos
    }
}
