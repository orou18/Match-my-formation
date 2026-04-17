<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminUsersController extends Controller
{
    /**
     * Vérifier que l'utilisateur est admin
     */
    private function ensureAdmin(): void
    {
        $user = auth()->user();
        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
    }

    /**
     * Lister tous les utilisateurs avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $query = User::query();

        // Filtres
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->whereNotNull('email_verified_at');
            } elseif ($status === 'inactive') {
                $query->whereNull('email_verified_at');
            } elseif ($status === 'suspended') {
                $query->where('status', 'suspended');
            }
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|in:student,creator,admin',
            'password' => 'required|string|min:8',
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            DB::beginTransaction();

            // Gérer l'upload de l'avatar si présent
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = Storage::url($avatarPath);
            }

            // Hasher le mot de passe
            $validated['password'] = Hash::make($validated['password']);
            $validated['email_verified_at'] = now(); // Auto-vérifier pour les créations admin

            $user = User::create($validated);

            // Charger les relations
            $user->load(['videos', 'enrollments', 'likedVideos']);

            DB::commit();

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un utilisateur spécifique
     */
    public function show($id): JsonResponse
    {
        $this->ensureAdmin();

        $user = User::with(['videos', 'enrollments', 'likedVideos', 'company'])
               ->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, $id): JsonResponse
    {
        $this->ensureAdmin();

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'role' => 'sometimes|required|in:student,creator,admin',
            'password' => 'sometimes|string|min:8',
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);

        try {
            DB::beginTransaction();

            // Gérer l'upload de l'avatar si présent
            if ($request->hasFile('avatar')) {
                // Supprimer l'ancien avatar s'il existe
                if ($user->avatar && str_contains($user->avatar, 'avatars/')) {
                    $oldAvatarPath = str_replace(Storage::url(''), '', $user->avatar);
                    Storage::disk('public')->delete($oldAvatarPath);
                }

                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $validated['avatar'] = Storage::url($avatarPath);
            }

            // Hasher le mot de passe si fourni
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Gérer le statut
            if (isset($validated['status'])) {
                if ($validated['status'] === 'active') {
                    $validated['email_verified_at'] = now();
                } elseif ($validated['status'] === 'inactive') {
                    $validated['email_verified_at'] = null;
                }
                unset($validated['status']); // On gère avec email_verified_at
            }

            $user->update($validated);

            // Recharger les relations
            $user->load(['videos', 'enrollments', 'likedVideos']);

            DB::commit();

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy($id): JsonResponse
    {
        $this->ensureAdmin();

        $user = User::findOrFail($id);

        // Empêcher la suppression d'un admin si c'est le seul
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Impossible de supprimer le dernier administrateur'
                ], 403);
            }
        }

        try {
            DB::beginTransaction();

            // Supprimer l'avatar s'il existe
            if ($user->avatar && str_contains($user->avatar, 'avatars/')) {
                $avatarPath = str_replace(Storage::url(''), '', $user->avatar);
                Storage::disk('public')->delete($avatarPath);
            }

            // Supprimer les relations
            $user->videos()->delete();
            $user->enrollments()->delete();
            $user->likedVideos()->detach();
            $user->notifications()->delete();

            // Supprimer l'utilisateur
            $user->delete();

            DB::commit();

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la suppression de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Action en masse sur les utilisateurs
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
            'action' => 'required|in:activate,deactivate,suspend,delete',
        ]);

        $userIds = $validated['user_ids'];
        $action = $validated['action'];

        try {
            DB::beginTransaction();

            switch ($action) {
                case 'activate':
                    User::whereIn('id', $userIds)->update(['email_verified_at' => now()]);
                    $message = 'Utilisateurs activés avec succès';
                    break;

                case 'deactivate':
                    User::whereIn('id', $userIds)->update(['email_verified_at' => null]);
                    $message = 'Utilisateurs désactivés avec succès';
                    break;

                case 'suspend':
                    User::whereIn('id', $userIds)->update(['status' => 'suspended']);
                    $message = 'Utilisateurs suspendus avec succès';
                    break;

                case 'delete':
                    // Vérifier qu'on ne supprime pas tous les admins
                    $adminCount = User::where('role', 'admin')->count();
                    $adminsInList = User::whereIn('id', $userIds)->where('role', 'admin')->count();
                    
                    if ($adminCount <= $adminsInList) {
                        return response()->json([
                            'message' => 'Impossible de supprimer tous les administrateurs'
                        ], 403);
                    }

                    User::whereIn('id', $userIds)->delete();
                    $message = 'Utilisateurs supprimés avec succès';
                    break;
            }

            DB::commit();

            return response()->json([
                'message' => $message,
                'affected_count' => count($userIds)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'action en masse',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques des utilisateurs
     */
    public function stats(): JsonResponse
    {
        $this->ensureAdmin();

        $stats = [
            'total_users' => User::count(),
            'active_users' => User::whereNotNull('email_verified_at')->count(),
            'inactive_users' => User::whereNull('email_verified_at')->count(),
            'suspended_users' => User::where('status', 'suspended')->count(),
            'by_role' => [
                'students' => User::where('role', 'student')->count(),
                'creators' => User::where('role', 'creator')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ],
            'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'monthly_growth' => $this->calculateMonthlyGrowth(),
        ];

        return response()->json($stats);
    }

    /**
     * Calculer la croissance mensuelle
     */
    private function calculateMonthlyGrowth(): array
    {
        $currentMonth = User::whereMonth('created_at', now()->month)
                           ->whereYear('created_at', now()->year)
                           ->count();

        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
                         ->whereYear('created_at', now()->subMonth()->year)
                         ->count();

        $growth = $lastMonth > 0 ? (($currentMonth - $lastMonth) / $lastMonth) * 100 : 0;

        return [
            'current_month' => $currentMonth,
            'last_month' => $lastMonth,
            'growth_percentage' => round($growth, 2)
        ];
    }
}
