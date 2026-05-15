<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentProgressController extends Controller
{
    /**
     * Obtenir la progression globale de l'étudiant
     */
    public function getGlobalProgress(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'student') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Statistiques globales
            $totalCourses = Course::whereHas('employees', function($query) use ($user) {
                $query->where('employee_id', $user->id);
            })->count();

            $completedCourses = EmployeeProgress::where('employee_id', $user->id)
                ->where('progress', 100)
                ->distinct('video_id')
                ->count();

            $inProgressCourses = EmployeeProgress::where('employee_id', $user->id)
                ->where('progress', '<', 100)
                ->distinct('video_id')
                ->count();

            $totalHours = EmployeeProgress::where('employee_id', $user->id)
                ->sum('watch_time') / 3600; // Convertir en heures

            $completedHours = EmployeeProgress::where('employee_id', $user->id)
                ->where('progress', 100)
                ->sum('watch_time') / 3600;

            $averageScore = EmployeeProgress::where('employee_id', $user->id)
                ->where('score', '>', 0)
                ->avg('score');

            // Calculer le streak (jours consécutifs)
            $streak = $this->calculateStreak($user->id);

            // Rang parmi les étudiants
            $rank = $this->calculateRank($user->id);

            // Cours en cours
            $coursesInProgress = $this->getCoursesInProgress($user->id);

            // Modules récents
            $recentModules = $this->getRecentModules($user->id);

            // Certifications
            $certifications = $this->getCertifications($user->id);

            $globalStats = [
                'totalCourses' => $totalCourses,
                'completedCourses' => $completedCourses,
                'inProgressCourses' => $inProgressCourses,
                'totalHours' => round($totalHours, 1),
                'completedHours' => round($completedHours, 1),
                'averageScore' => round($averageScore, 1),
                'streak' => $streak,
                'rank' => $rank,
                'totalStudents' => User::where('role', 'student')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'coursesInProgress' => $coursesInProgress,
                    'recentModules' => $recentModules,
                    'certifications' => $certifications,
                    'globalStats' => $globalStats,
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
     * Obtenir les détails de progression pour un cours spécifique
     */
    public function getCourseProgress(Request $request, $courseId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'student') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $course = Course::with(['videos', 'creator'])
                ->findOrFail($courseId);

            // Vérifier si l'étudiant est inscrit
            $isEnrolled = Employee::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->exists();

            if (!$isEnrolled) {
                return response()->json(['error' => 'Non inscrit à ce cours'], 403);
            }

            // Progression par vidéo
            $videoProgress = EmployeeProgress::where('employee_id', $user->id)
                ->join('videos', 'employee_progress.video_id', '=', 'videos.id')
                ->where('videos.course_id', $courseId)
                ->select(
                    'employee_progress.*',
                    'videos.title as video_title',
                    'videos.duration as video_duration',
                    'videos.thumbnail as video_thumbnail'
                )
                ->get()
                ->map(function($progress) {
                    return [
                        'id' => $progress->id,
                        'video_title' => $progress->video_title,
                        'video_duration' => $progress->video_duration,
                        'video_thumbnail' => $progress->video_thumbnail,
                        'progress' => $progress->progress,
                        'watch_time' => $progress->watch_time,
                        'last_watched_at' => $progress->last_watched_at,
                        'score' => $progress->score,
                        'completed' => $progress->progress >= 100,
                    ];
                });

            // Statistiques du cours
            $totalVideos = $course->videos->count();
            $completedVideos = $videoProgress->where('completed')->count();
            $courseProgress = $totalVideos > 0 ? ($completedVideos / $totalVideos) * 100 : 0;
            $totalWatchTime = $videoProgress->sum('watch_time') / 3600; // En heures

            return response()->json([
                'success' => true,
                'data' => [
                    'course' => [
                        'id' => $course->id,
                        'title' => $course->title,
                        'description' => $course->description,
                        'thumbnail' => $course->thumbnail,
                        'creator' => $course->creator,
                        'total_videos' => $totalVideos,
                    ],
                    'videoProgress' => $videoProgress->toArray(),
                    'stats' => [
                        'progress' => round($courseProgress, 1),
                        'completed_videos' => $completedVideos,
                        'total_videos' => $totalVideos,
                        'total_watch_time' => round($totalWatchTime, 1),
                        'estimated_completion_time' => round(($totalVideos - $completedVideos) * 0.5, 1), // 30min par vidéo
                    ],
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
     * Mettre à jour la progression d'une vidéo
     */
    public function updateVideoProgress(Request $request, $videoId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'student') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'progress' => 'required|integer|min:0|max:100',
                'watch_time' => 'required|integer|min:0',
                'score' => 'nullable|integer|min:0|max:100',
            ]);

            // Vérifier si la vidéo existe et si l'étudiant y a accès
            $video = Video::findOrFail($videoId);
            
            $hasAccess = Employee::where('user_id', $user->id)
                ->where('creator_id', $video->uploader_id)
                ->exists();

            if (!$hasAccess) {
                return response()->json(['error' => 'Accès non autorisé à cette vidéo'], 403);
            }

            // Mettre à jour ou créer la progression
            $progress = EmployeeProgress::updateOrCreate(
                [
                    'employee_id' => $user->id,
                    'video_id' => $videoId,
                ],
                [
                    'progress' => $validated['progress'],
                    'watch_time' => $validated['watch_time'],
                    'score' => $validated['score'] ?? null,
                    'last_watched_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Progression mise à jour avec succès',
                'progress' => $progress,
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
            if (!$user || $user->role !== 'student') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $video = Video::findOrFail($videoId);
            
            $hasAccess = Employee::where('user_id', $user->id)
                ->where('creator_id', $video->uploader_id)
                ->exists();

            if (!$hasAccess) {
                return response()->json(['error' => 'Accès non autorisé à cette vidéo'], 403);
            }

            $progress = EmployeeProgress::updateOrCreate(
                [
                    'employee_id' => $user->id,
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
                'progress' => $progress,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculer le streak de jours consécutifs
     */
    private function calculateStreak($userId)
    {
        $streak = 0;
        $currentDate = now();

        for ($i = 0; $i < 365; $i++) { // Vérifier jusqu'à 1 an
            $hasActivity = EmployeeProgress::where('employee_id', $userId)
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
     * Calculer le rang de l'étudiant
     */
    private function calculateRank($userId)
    {
        $studentScores = EmployeeProgress::select('employee_id', 
                \DB::raw('AVG(CASE WHEN score > 0 THEN score ELSE 0 END) as avg_score'))
            ->groupBy('employee_id')
            ->orderBy('avg_score', 'desc')
            ->get();

        $rank = 1;
        foreach ($studentScores as $student) {
            if ($student->employee_id == $userId) {
                break;
            }
            $rank++;
        }

        return $rank;
    }

    /**
     * Obtenir les cours en cours
     */
    private function getCoursesInProgress($userId)
    {
        return EmployeeProgress::with(['video.creator', 'video.course'])
            ->where('employee_id', $userId)
            ->where('progress', '<', 100)
            ->distinct('video_id')
            ->get()
            ->map(function($progress) {
                return [
                    'id' => $progress->video->course->id ?? $progress->video->id,
                    'title' => $progress->video->course->title ?? $progress->video->title,
                    'module' => $progress->video->title,
                    'progress' => $progress->progress,
                    'image' => $progress->video->thumbnail,
                    'totalModules' => $progress->video->course->videos_count ?? 1,
                    'completedModules' => 1, // Simplifié
                    'estimatedTime' => $progress->video->duration,
                    'difficulty' => 'Intermédiaire',
                    'instructor' => [
                        'name' => $progress->video->creator->name,
                        'avatar' => $progress->video->creator->avatar ?? '/default-avatar.png',
                        'specialty' => 'Expert',
                    ],
                    'isPremium' => false,
                    'enrolledAt' => $progress->created_at->format('Y-m-d'),
                    'lastAccessed' => $progress->last_watched_at->format('Y-m-d'),
                ];
            })
            ->take(5)
            ->toArray();
    }

    /**
     * Obtenir les modules récents
     */
    private function getRecentModules($userId)
    {
        return EmployeeProgress::with(['video'])
            ->where('employee_id', $userId)
            ->orderBy('last_watched_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($progress) {
                return [
                    'id' => $progress->id,
                    'title' => $progress->video->title,
                    'course' => 'Module individuel',
                    'date' => $progress->last_watched_at->format('Y-m-d'),
                    'duration' => $progress->video->duration,
                    'type' => 'video',
                    'completed' => $progress->progress >= 100,
                    'score' => $progress->score,
                    'videoUrl' => $progress->video->video_url,
                    'thumbnail' => $progress->video->thumbnail,
                    'progress' => $progress->progress,
                ];
            })
            ->toArray();
    }

    /**
     * Obtenir les certifications
     */
    private function getCertifications($userId)
    {
        // Simuler des certifications pour l'instant
        // En production, cela viendrait d'une table certifications
        $completedVideos = EmployeeProgress::where('employee_id', $userId)
            ->where('progress', 100)
            ->count();

        $certifications = [];

        if ($completedVideos >= 5) {
            $certifications[] = [
                'id' => 1,
                'title' => 'Certification de Base',
                'description' => '5 vidéos complétées avec succès',
                'date' => now()->subDays(30)->format('Y-m-d'),
                'progress' => 100,
                'status' => 'Obtenu',
                'score' => 85,
                'downloadUrl' => '/certificates/base-certificate.pdf',
                'issuer' => 'Match My Formation',
                'credentialId' => 'CERT-BASE-' . $userId,
                'expiresAt' => now()->addYear()->format('Y-m-d'),
                'skills' => ['Base numérique', 'Autonomie'],
            ];
        }

        if ($completedVideos >= 10) {
            $certifications[] = [
                'id' => 2,
                'title' => 'Certification Intermédiaire',
                'description' => '10 vidéos complétées avec excellence',
                'date' => now()->subDays(15)->format('Y-m-d'),
                'progress' => 100,
                'status' => 'Obtenu',
                'score' => 92,
                'downloadUrl' => '/certificates/intermediate-certificate.pdf',
                'issuer' => 'Match My Formation',
                'credentialId' => 'CERT-INTER-' . $userId,
                'expiresAt' => now()->addYear()->format('Y-m-d'),
                'skills' => ['Compétences avancées', 'Spécialisation'],
            ];
        }

        return $certifications;
    }
}
