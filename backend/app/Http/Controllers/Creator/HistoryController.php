<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\Pathway;
use App\Models\Employee;
use App\Models\EmployeePathway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $history = [];
            $dateRange = $request->get('date_range', '30d');

            // Récupérer les vidéos créées
            $videos = Video::where('uploader_id', $user->id)
                ->when($dateRange !== 'all', function ($query) use ($dateRange) {
                    $days = (int) str_replace('d', '', $dateRange);
                    return $query->where('created_at', '>=', Carbon::now()->subDays($days));
                })
                ->latest()
                ->get();

            foreach ($videos as $video) {
                $history[] = [
                    'id' => 'video_' . $video->id,
                    'type' => 'video_upload',
                    'title' => 'Nouvelle vidéo créée',
                    'description' => $video->title,
                    'videoTitle' => $video->title,
                    'timestamp' => $video->created_at->toISOString(),
                    'status' => $video->visibility === 'public' ? 'completed' : 'pending',
                    'metadata' => [
                        'videoId' => $video->id,
                        'views' => $video->views ?? 0,
                        'likes' => $video->likes ?? 0,
                    ],
                ];
            }

            // Récupérer les parcours créés
            $pathways = Pathway::where('creator_id', $user->id)
                ->when($dateRange !== 'all', function ($query) use ($dateRange) {
                    $days = (int) str_replace('d', '', $dateRange);
                    return $query->where('created_at', '>=', Carbon::now()->subDays($days));
                })
                ->latest()
                ->get();

            foreach ($pathways as $pathway) {
                $history[] = [
                    'id' => 'pathway_' . $pathway->id,
                    'type' => 'course_update',
                    'title' => 'Nouveau parcours créé',
                    'description' => $pathway->title,
                    'timestamp' => $pathway->created_at->toISOString(),
                    'status' => 'completed',
                    'metadata' => [
                        'pathwayId' => $pathway->id,
                        'videosCount' => $pathway->videos->count(),
                    ],
                ];
            }

            // Récupérer les assignations de parcours aux employés
            $assignments = EmployeePathway::where('creator_id', $user->id)
                ->with(['employee', 'pathway'])
                ->when($dateRange !== 'all', function ($query) use ($dateRange) {
                    $days = (int) str_replace('d', '', $dateRange);
                    return $query->where('assigned_at', '>=', Carbon::now()->subDays($days));
                })
                ->latest('assigned_at')
                ->get();

            foreach ($assignments as $assignment) {
                $history[] = [
                    'id' => 'enrollment_' . $assignment->id,
                    'type' => 'enrollment',
                    'title' => 'Parcours assigné',
                    'description' => $assignment->pathway->title,
                    'studentName' => $assignment->employee->name,
                    'timestamp' => $assignment->assigned_at->toISOString(),
                    'status' => 'completed',
                    'metadata' => [
                        'studentId' => $assignment->employee->id,
                        'pathwayId' => $assignment->pathway->id,
                    ],
                ];
            }

            // Trier par date
            usort($history, function ($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            return response()->json([
                'success' => true,
                'history' => $history,
                'total' => count($history),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getStats(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $dateRange = $request->get('date_range', '30d');
            $days = $dateRange === 'all' ? 365 : (int) str_replace('d', '', $dateRange);

            // Statistiques des vidéos
            $videosStats = Video::where('uploader_id', $user->id)
                ->when($dateRange !== 'all', function ($query) use ($days) {
                    return $query->where('created_at', '>=', Carbon::now()->subDays($days));
                })
                ->selectRaw('
                    COUNT(*) as total_videos,
                    SUM(views) as total_views,
                    SUM(likes) as total_likes,
                    SUM(comments) as total_comments,
                    AVG(views) as avg_views
                ')
                ->first();

            // Statistiques des parcours
            $pathwaysStats = Pathway::where('creator_id', $user->id)
                ->when($dateRange !== 'all', function ($query) use ($days) {
                    return $query->where('created_at', '>=', Carbon::now()->subDays($days));
                })
                ->withCount(['videos', 'employeePathways'])
                ->selectRaw('
                    COUNT(*) as total_pathways,
                    SUM(duration_hours) as total_duration
                ')
                ->first();

            // Statistiques des employés
            $employeesStats = Employee::where('creator_id', $user->id)
                ->withCount(['employeePathways' => function ($query) use ($days) {
                    if ($days < 365) {
                        $query->where('assigned_at', '>=', Carbon::now()->subDays($days));
                    }
                }])
                ->selectRaw('
                    COUNT(*) as total_employees,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_employees
                ')
                ->first();

            return response()->json([
                'success' => true,
                'stats' => [
                    'videos' => [
                        'total' => $videosStats->total_videos ?? 0,
                        'total_views' => $videosStats->total_views ?? 0,
                        'total_likes' => $videosStats->total_likes ?? 0,
                        'total_comments' => $videosStats->total_comments ?? 0,
                        'avg_views' => round($videosStats->avg_views ?? 0, 2),
                    ],
                    'pathways' => [
                        'total' => $pathwaysStats->total_pathways ?? 0,
                        'total_duration' => $pathwaysStats->total_duration ?? 0,
                        'total_videos' => $pathwaysStats->videos_count ?? 0,
                        'total_assignments' => $pathwaysStats->employee_pathways_count ?? 0,
                    ],
                    'employees' => [
                        'total' => $employeesStats->total_employees ?? 0,
                        'active' => $employeesStats->active_employees ?? 0,
                        'assignments' => $employeesStats->employee_pathways_count ?? 0,
                    ],
                ],
                'date_range' => $dateRange,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
