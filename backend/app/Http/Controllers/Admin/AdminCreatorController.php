<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminCreatorController extends Controller
{
    /**
     * Liste tous les créateurs
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = User::where('role', 'creator')
                ->with(['videos' => function($q) {
                    $q->select('uploader_id', 'views', 'likes', 'comments', 'created_at');
                }])
                ->withCount(['videos', 'employees']);

            // Filtrage par statut
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filtrage par catégorie
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $creators = $query->paginate($request->get('per_page', 15));

            // Calculer les stats pour chaque créateur
            $creators->getCollection()->transform(function ($creator) {
                $totalViews = $creator->videos->sum('views');
                $totalLikes = $creator->videos->sum('likes');
                $totalRevenue = $totalViews * 0.01; // 1 centime par vue
                
                // Calculer la note moyenne (basée sur les vidéos)
                $avgRating = $creator->videos->count() > 0 
                    ? min(5, 3.5 + ($totalLikes / max(1, $totalViews)) * 2) 
                    : 0;

                return [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                    'avatar' => $creator->avatar ?? '/temoignage.png',
                    'status' => $creator->status ?? 'active',
                    'join_date' => $creator->created_at->format('Y-m-d'),
                    'category' => $creator->category ?? 'Marketing',
                    'courses' => $creator->videos_count,
                    'students' => $creator->employees_count,
                    'revenue' => round($totalRevenue, 2),
                    'rating' => round($avgRating, 1),
                    'total_views' => $totalViews,
                    'created_at' => $creator->created_at,
                    'updated_at' => $creator->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'creators' => $creators->items(),
                'pagination' => [
                    'current_page' => $creators->currentPage(),
                    'total_pages' => $creators->lastPage(),
                    'total_items' => $creators->total(),
                    'per_page' => $creators->perPage(),
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
     * Crée un nouveau créateur
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
                'category' => 'required|string|max:100',
                'bio' => 'nullable|string|max:1000',
                'expertise' => 'nullable|string|max:500',
                'status' => 'required|in:active,pending,suspended',
            ]);

            $creator = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'creator',
                'category' => $validated['category'],
                'bio' => $validated['bio'] ?? '',
                'expertise' => $validated['expertise'] ?? '',
                'status' => $validated['status'],
                'email_verified_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Créateur créé avec succès',
                'creator' => [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                    'status' => $creator->status,
                    'category' => $creator->category,
                    'join_date' => $creator->created_at->format('Y-m-d'),
                    'courses' => 0,
                    'students' => 0,
                    'revenue' => 0,
                    'rating' => 0,
                    'total_views' => 0,
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
     * Affiche un créateur spécifique
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $creator = User::where('role', 'creator')
                ->with(['videos' => function($q) {
                    $q->select('id', 'title', 'views', 'likes', 'comments', 'created_at');
                }])
                ->withCount(['videos', 'employees'])
                ->findOrFail($id);

            $totalViews = $creator->videos->sum('views');
            $totalLikes = $creator->videos->sum('likes');
            $totalRevenue = $totalViews * 0.01;
            $avgRating = $creator->videos->count() > 0 
                ? min(5, 3.5 + ($totalLikes / max(1, $totalViews)) * 2) 
                : 0;

            $creatorData = [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
                'avatar' => $creator->avatar ?? '/temoignage.png',
                'status' => $creator->status ?? 'active',
                'join_date' => $creator->created_at->format('Y-m-d'),
                'category' => $creator->category ?? 'Marketing',
                'bio' => $creator->bio ?? '',
                'expertise' => $creator->expertise ?? '',
                'courses' => $creator->videos_count,
                'students' => $creator->employees_count,
                'revenue' => round($totalRevenue, 2),
                'rating' => round($avgRating, 1),
                'total_views' => $totalViews,
                'videos' => $creator->videos->map(function($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'views' => $video->views,
                        'likes' => $video->likes,
                        'comments' => $video->comments,
                        'created_at' => $video->created_at,
                    ];
                }),
            ];

            return response()->json([
                'success' => true,
                'creator' => $creatorData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour un créateur
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $creator = User::where('role', 'creator')->findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'category' => 'sometimes|string|max:100',
                'bio' => 'sometimes|string|max:1000',
                'expertise' => 'sometimes|string|max:500',
                'status' => 'sometimes|in:active,pending,suspended',
                'password' => 'sometimes|string|min:8',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $creator->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Créateur mis à jour avec succès',
                'creator' => [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                    'status' => $creator->status,
                    'category' => $creator->category,
                    'bio' => $creator->bio,
                    'expertise' => $creator->expertise,
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
     * Supprime un créateur
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $creator = User::where('role', 'creator')->findOrFail($id);

            // Vérifier si le créateur a des vidéos ou des employés
            $videoCount = Video::where('uploader_id', $creator->id)->count();
            $employeeCount = Employee::where('creator_id', $creator->id)->count();

            if ($videoCount > 0 || $employeeCount > 0) {
                return response()->json([
                    'success' => false,
                    'error' => 'Impossible de supprimer un créateur avec des vidéos ou des employés actifs',
                    'video_count' => $videoCount,
                    'employee_count' => $employeeCount
                ], 400);
            }

            $creator->delete();

            return response()->json([
                'success' => true,
                'message' => 'Créateur supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suspendre ou activer un créateur
     */
    public function toggleStatus($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $creator = User::where('role', 'creator')->findOrFail($id);
            
            $newStatus = $creator->status === 'active' ? 'suspended' : 'active';
            $creator->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => "Créateur {$newStatus} avec succès",
                'status' => $newStatus
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des créateurs
     */
    public function stats()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $stats = [
                'total' => User::where('role', 'creator')->count(),
                'active' => User::where('role', 'creator')->where('status', 'active')->count(),
                'pending' => User::where('role', 'creator')->where('status', 'pending')->count(),
                'suspended' => User::where('role', 'creator')->where('status', 'suspended')->count(),
                'by_category' => User::where('role', 'creator')
                    ->selectRaw('category, COUNT(*) as count')
                    ->groupBy('category')
                    ->pluck('count', 'category')
                    ->toArray(),
                'total_revenue' => Video::join('users', 'videos.uploader_id', '=', 'users.id')
                    ->where('users.role', 'creator')
                    ->sum('views') * 0.01,
                'total_videos' => Video::join('users', 'videos.uploader_id', '=', 'users.id')
                    ->where('users.role', 'creator')
                    ->count(),
                'top_creators' => User::where('role', 'creator')
                    ->withCount(['videos'])
                    ->withSum('videos', 'views')
                    ->orderBy('videos_sum_views', 'desc')
                    ->limit(5)
                    ->get(['id', 'name', 'videos_count', 'videos_sum_views']),
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
