<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmployeeProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /**
     * Liste tous les utilisateurs
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = User::withCount(['videos as courses_completed']);

            // Filtrage par rôle
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            // Filtrage par statut
            // Recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->paginate($request->get('per_page', 15));

            // Transformer les données
            $users->getCollection()->transform(function ($user) {
                // Déterminer le type d'abonnement
                $subscription = 'Free';
                if ($user->role === 'admin') {
                    $subscription = 'Admin';
                } elseif ($user->role === 'creator') {
                    $subscription = 'Pro';
                } else {
                    // Pour les étudiants, baser sur les cours complétés
                    $subscription = $user->courses_completed >= 10 ? 'Premium' : 'Free';
                }

                // Calculer la dernière activité (basée sur la progression)
                $lastActivity = EmployeeProgress::where('employee_id', $user->id)
                    ->max('last_watched_at');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => 'active',
                    'join_date' => $user->created_at->format('Y-m-d'),
                    'last_active' => $lastActivity ? $lastActivity->format('Y-m-d') : $user->updated_at->format('Y-m-d'),
                    'subscription' => $subscription,
                    'courses_completed' => $user->courses_completed,
                    'avatar' => $user->avatar ?? '/temoignage.png',
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'users' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'total_pages' => $users->lastPage(),
                    'total_items' => $users->total(),
                    'per_page' => $users->perPage(),
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
     * Crée un nouvel utilisateur
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|in:student,creator,admin',
                'bio' => 'nullable|string|max:1000',
            ]);

            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'bio' => $validated['bio'] ?? '',
                'email_verified_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'user' => [
                    'id' => $newUser->id,
                    'name' => $newUser->name,
                    'email' => $newUser->email,
                    'role' => $newUser->role,
                    'status' => 'active',
                    'join_date' => $newUser->created_at->format('Y-m-d'),
                    'subscription' => $newUser->role === 'admin' ? 'Admin' : 'Free',
                    'courses_completed' => 0,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche un utilisateur spécifique
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $targetUser = User::withCount(['videos as courses_completed'])
                ->findOrFail($id);

            // Déterminer l'abonnement
            $subscription = 'Free';
            if ($targetUser->role === 'admin') {
                $subscription = 'Admin';
            } elseif ($targetUser->role === 'creator') {
                $subscription = 'Pro';
            } else {
                $subscription = $targetUser->courses_completed >= 10 ? 'Premium' : 'Free';
            }

            // Dernière activité
            $lastActivity = EmployeeProgress::where('employee_id', $targetUser->id)
                ->max('last_watched_at');

            $userData = [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'role' => $targetUser->role,
                'status' => 'active',
                'bio' => $targetUser->bio ?? '',
                'expertise' => '',
                'join_date' => $targetUser->created_at->format('Y-m-d'),
                'last_active' => $lastActivity ? $lastActivity->format('Y-m-d') : $targetUser->updated_at->format('Y-m-d'),
                'subscription' => $subscription,
                'courses_completed' => $targetUser->courses_completed,
                'avatar' => $targetUser->avatar ?? '/temoignage.png',
                'created_at' => $targetUser->created_at,
                'updated_at' => $targetUser->updated_at,
            ];

            return response()->json([
                'success' => true,
                'user' => $userData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour un utilisateur
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $targetUser = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'role' => 'sometimes|in:student,creator,admin',
                'bio' => 'sometimes|string|max:1000',
                'password' => 'sometimes|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $targetUser->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'user' => [
                    'id' => $targetUser->id,
                    'name' => $targetUser->name,
                    'email' => $targetUser->email,
                    'role' => $targetUser->role,
                    'status' => 'active',
                    'bio' => $targetUser->bio,
                    'expertise' => '',
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
     * Supprime un utilisateur
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $targetUser = User::findOrFail($id);

            // Empêcher la suppression d'autres admins
            if ($targetUser->role === 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de supprimer un administrateur'
                ], 400);
            }

            // Vérifier les dépendances
            $dependencies = [];
            
            if ($targetUser->role === 'creator') {
                $videoCount = \App\Models\Video::where('uploader_id', $targetUser->id)->count();
                $employeeCount = \App\Models\Employee::where('creator_id', $targetUser->id)->count();
                
                if ($videoCount > 0) {
                    $dependencies['videos'] = $videoCount;
                }
                if ($employeeCount > 0) {
                    $dependencies['employees'] = $employeeCount;
                }
            }

            if ($targetUser->role === 'student') {
                $progressCount = EmployeeProgress::where('employee_id', $targetUser->id)->count();
                if ($progressCount > 0) {
                    $dependencies['progress'] = $progressCount;
                }
            }

            if (!empty($dependencies)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de supprimer cet utilisateur en raison de dépendances',
                    'dependencies' => $dependencies
                ], 400);
            }

            $targetUser->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suspendre ou activer un utilisateur
     */
    public function toggleStatus($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $targetUser = User::findOrFail($id);
            
            // Empêcher la suspension d'autres admins
            if ($targetUser->role === 'admin' && $targetUser->id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de suspendre un autre administrateur'
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Le statut utilisateur nécessite une colonne dédiée avant activation.',
                'status' => 'active'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des utilisateurs
     */
    public function stats()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $stats = [
                'total' => User::count(),
                'active' => User::count(),
                'inactive' => 0,
                'suspended' => 0,
                'by_role' => User::selectRaw('role, COUNT(*) as count')
                    ->groupBy('role')
                    ->pluck('count', 'role')
                    ->toArray(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))
                    ->count(),
                'active_today' => User::where('updated_at', '>=', now()->subDay())->count(),
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

    /**
     * Exporter les utilisateurs en CSV
     */
    public function export(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = User::withCount(['videos as courses_completed']);

            // Appliquer les mêmes filtres que l'index
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            $users = $query->get();

            $csvData = [];
            $csvData[] = ['ID', 'Nom', 'Email', 'Rôle', 'Statut', 'Date d\'inscription', 'Cours complétés'];

            foreach ($users as $user) {
                $csvData[] = [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    'active',
                    $user->created_at->format('Y-m-d'),
                    $user->courses_completed
                ];
            }

            $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.csv';
            
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ];

            $callback = function() use ($csvData) {
                $file = fopen('php://output', 'w');
                foreach ($csvData as $row) {
                    fputcsv($file, $row);
                }
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
