<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminNotificationController extends Controller
{
    /**
     * Liste toutes les notifications admin
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = AdminNotification::with('creator:id,name,email')
                ->orderBy('created_at', 'desc');

            // Filtrage par type
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            // Filtrage par statut
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filtrage par cible
            if ($request->has('target') && $request->target !== 'all') {
                $query->where('target', $request->target);
            }

            // Recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('message', 'like', "%{$search}%");
                });
            }

            $notifications = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'notifications' => $notifications->items(),
                'pagination' => [
                    'current_page' => $notifications->currentPage(),
                    'total_pages' => $notifications->lastPage(),
                    'total_items' => $notifications->total(),
                    'per_page' => $notifications->perPage(),
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
     * Crée une nouvelle notification admin
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'message' => 'required|string|max:1000',
                'type' => 'required|in:' . implode(',', AdminNotification::TYPES),
                'target' => 'required|in:' . implode(',', AdminNotification::TARGETS),
                'status' => 'required|in:' . implode(',', AdminNotification::STATUSES),
                'scheduled_at' => 'nullable|date|after:now',
            ]);

            $notification = AdminNotification::create([
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'target' => $validated['target'],
                'status' => $validated['status'],
                'scheduled_at' => $validated['scheduled_at'] ?? null,
                'created_by' => $user->id,
            ]);

            // Si le statut est "sent", envoyer immédiatement
            if ($validated['status'] === 'sent') {
                $notification->send();
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification créée avec succès',
                'notification' => $notification->load('creator:id,name,email')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche une notification spécifique
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notification = AdminNotification::with('creator:id,name,email')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'notification' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour une notification
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notification = AdminNotification::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'message' => 'sometimes|string|max:1000',
                'type' => 'sometimes|in:' . implode(',', AdminNotification::TYPES),
                'target' => 'sometimes|in:' . implode(',', AdminNotification::TARGETS),
                'status' => 'sometimes|in:' . implode(',', AdminNotification::STATUSES),
                'scheduled_at' => 'nullable|date|after:now',
            ]);

            $notification->update($validated);

            // Si le statut passe à "sent", envoyer la notification
            if (isset($validated['status']) && $validated['status'] === 'sent' && $notification->status !== 'sent') {
                $notification->send();
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification mise à jour avec succès',
                'notification' => $notification->load('creator:id,name,email')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une notification
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notification = AdminNotification::findOrFail($id);

            // Ne peut supprimer que les notifications en brouillon ou programmées
            if (in_array($notification->status, ['sent'])) {
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de supprimer une notification déjà envoyée'
                ], 400);
            }

            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envoyer une notification immédiatement
     */
    public function send($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $notification = AdminNotification::findOrFail($id);

            if ($notification->status === 'sent') {
                return response()->json([
                    'success' => false,
                    'error' => 'Notification déjà envoyée'
                ], 400);
            }

            $success = $notification->send();

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Notification envoyée avec succès',
                    'notification' => $notification->load('creator:id,name,email')
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Erreur lors de l\'envoi de la notification'
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des notifications
     */
    public function stats()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $stats = [
                'total' => AdminNotification::count(),
                'draft' => AdminNotification::where('status', 'draft')->count(),
                'scheduled' => AdminNotification::where('status', 'scheduled')->count(),
                'sent' => AdminNotification::where('status', 'sent')->count(),
                'by_type' => AdminNotification::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type')
                    ->toArray(),
                'by_target' => AdminNotification::selectRaw('target, COUNT(*) as count')
                    ->groupBy('target')
                    ->pluck('count', 'target')
                    ->toArray(),
                'recent' => AdminNotification::with('creator:id,name')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
