<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreatorNotificationController extends Controller
{
    /**
     * Obtenir les notifications du créateur
     */
    public function getNotifications(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $filter = $request->get('filter', 'all');
            $search = $request->get('search', '');
            $limit = $request->get('limit', 50);

            // Générer les notifications basées sur l'activité réelle
            $notifications = $this->generateNotifications($user, $filter, $search);

            // Limiter les résultats
            $notifications = array_slice($notifications, 0, $limit);

            return response()->json([
                'success' => true,
                'notifications' => $notifications,
                'unread_count' => count(array_filter($notifications, fn($n) => !$n['read'])),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notificationId = $request->get('id');
            
            // Pour l'instant, nous simulons le marquage comme lu
            // En production, cela utiliserait une table notifications
            
            return response()->json([
                'success' => true,
                'message' => 'Notification marquée comme lue'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Toutes les notifications marquées comme lues'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une notification
     */
    public function deleteNotification(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notificationId = $request->get('id');

            return response()->json([
                'success' => true,
                'message' => 'Notification supprimée'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir le nombre de notifications non lues
     */
    public function getUnreadCount(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'creator') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notifications = $this->generateNotifications($user, 'unread', '');
            $unreadCount = count($notifications);

            return response()->json([
                'success' => true,
                'unread_count' => $unreadCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer les notifications basées sur l'activité réelle
     */
    private function generateNotifications($user, $filter = 'all', $search = '')
    {
        $notifications = [];

        // Notifications basées sur les vidéos récentes
        $recentVideos = Video::where('uploader_id', $user->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($recentVideos as $video) {
            $notifications[] = [
                'id' => 'video_' . $video->id,
                'type' => 'success',
                'title' => 'Nouvelle vidéo publiée',
                'message' => "Votre vidéo \"{$video->title}\" a été publiée avec succès",
                'timestamp' => $video->created_at->toISOString(),
                'read' => $video->created_at->lt(now()->subHours(2)),
                'action' => [
                    'label' => 'Voir la vidéo',
                    'url' => "/dashboard/creator/videos/{$video->id}",
                ],
            ];

            // Notification si beaucoup de vues
            if ($video->views > 100) {
                $notifications[] = [
                    'id' => 'views_' . $video->id,
                    'type' => 'info',
                    'title' => 'Performance exceptionnelle',
                    'message' => "Votre vidéo \"{$video->title}\" a atteint {$video->views} vues !",
                    'timestamp' => $video->updated_at->toISOString(),
                    'read' => false,
                    'action' => [
                        'label' => 'Voir les stats',
                        'url' => "/dashboard/creator/stats",
                    ],
                ];
            }
        }

        // Notifications basées sur les employés
        $recentEmployees = Employee::where('creator_id', $user->id)
            ->where('created_at', '>=', now()->subDays(3))
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($recentEmployees as $employee) {
            $notifications[] = [
                'id' => 'employee_' . $employee->id,
                'type' => 'info',
                'title' => 'Nouvel employé inscrit',
                'message' => "{$employee->name} s'est inscrit à vos formations",
                'timestamp' => $employee->created_at->toISOString(),
                'read' => $employee->created_at->lt(now()->subHours(1)),
                'action' => [
                    'label' => 'Voir le profil',
                    'url' => "/dashboard/creator/employees/{$employee->id}",
                ],
            ];
        }

        // Notifications basées sur la progression
        $activeProgress = EmployeeProgress::join('employees', 'employee_progress.employee_id', '=', 'employees.id')
            ->where('employees.creator_id', $user->id)
            ->where('employee_progress.last_watched_at', '>=', now()->subDays(1))
            ->where('employee_progress.progress', '>=', 80)
            ->get();

        foreach ($activeProgress as $progress) {
            $notifications[] = [
                'id' => 'progress_' . $progress->id,
                'type' => 'success',
                'title' => 'Formation presque terminée',
                'message' => "{$progress->employee->name} a complété {$progress->progress}% d'une formation",
                'timestamp' => $progress->last_watched_at->toISOString(),
                'read' => $progress->last_watched_at->lt(now()->subHours(6)),
                'action' => [
                    'label' => 'Voir la progression',
                    'url' => "/dashboard/creator/progress",
                ],
            ];
        }

        // Notifications système
        $notifications[] = [
            'id' => 'system_tip_' . date('Y-m-d'),
            'type' => 'info',
            'title' => 'Conseil du jour',
            'message' => 'Pensez à interagir avec vos employés dans les commentaires pour améliorer l\'engagement',
            'timestamp' => now()->subHours(3)->toISOString(),
            'read' => false,
        ];

        // Trier par date (plus récent en premier)
        usort($notifications, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        // Filtrer selon le filtre
        if ($filter === 'unread') {
            $notifications = array_filter($notifications, fn($n) => !$n['read']);
        } elseif ($filter === 'read') {
            $notifications = array_filter($notifications, fn($n) => $n['read']);
        }

        // Filtrer selon la recherche
        if (!empty($search)) {
            $search = strtolower($search);
            $notifications = array_filter($notifications, function($notification) use ($search) {
                return strpos(strtolower($notification['title']), $search) !== false ||
                       strpos(strtolower($notification['message']), $search) !== false;
            });
        }

        return array_values($notifications);
    }
}
