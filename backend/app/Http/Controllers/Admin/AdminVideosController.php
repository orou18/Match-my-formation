<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoLike;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminVideosController extends Controller
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
     * Lister toutes les vidéos avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $query = Video::with(['creator', 'likes', 'comments']);

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

        if ($request->filled('visibility') && $request->input('visibility') !== 'all') {
            $query->where('visibility', $request->input('visibility'));
        }

        if ($request->filled('published') && $request->input('published') !== 'all') {
            $isPublished = $request->input('published') === 'published';
            $query->where('is_published', $isPublished);
        }

        if ($request->filled('creator_id')) {
            $query->where('uploader_id', $request->input('creator_id'));
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 12);
        $videos = $query->paginate($perPage);

        // Transformer les données pour le frontend
        $transformedVideos = $videos->getCollection()->map(function ($video) {
            return [
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'category' => $video->category,
                'tags' => $video->tags ?? [],
                'learning_objectives' => $video->learning_objectives ?? [],
                'visibility' => $video->visibility,
                'duration' => $video->duration,
                'allow_comments' => $video->allow_comments,
                'publish_immediately' => $video->publish_immediately,
                'is_admin_video' => $video->is_admin_video ?? false,
                'is_published' => $video->is_published,
                'creator' => [
                    'id' => $video->creator->id ?? null,
                    'name' => $video->creator->name ?? 'Admin',
                    'email' => $video->creator->email ?? null,
                    'avatar' => $video->creator->avatar ?? null,
                ],
                'video_url' => $video->video_url,
                'thumbnail' => $video->thumbnail,
                'students_count' => $video->students_count ?? 0,
                'views' => $video->views ?? 0,
                'likes' => $video->likes->count() ?? 0,
                'comments' => $video->comments ?? [],
                'created_at' => $video->created_at,
                'updated_at' => $video->updated_at,
            ];
        });

        return response()->json([
            'data' => $transformedVideos,
            'pagination' => [
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
                'per_page' => $videos->perPage(),
                'total' => $videos->total(),
            ]
        ]);
    }

    /**
     * Créer une nouvelle vidéo en tant qu'admin
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'category' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'learning_objectives' => 'nullable|array',
            'learning_objectives.*' => 'string|max:255',
            'visibility' => 'required|in:private,public,unlisted',
            'duration' => 'required|string|max:20',
            'allow_comments' => 'boolean',
            'publish_immediately' => 'boolean',
            'video_file' => 'required|file|mimes:mp4,avi,mov,wmv|max:102400', // 100MB max
            'thumbnail_file' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        try {
            DB::beginTransaction();

            // Gérer l'upload de la vidéo
            if ($request->hasFile('video_file')) {
                $videoPath = $request->file('video_file')->store('videos/admin', 'public');
                $validated['video_url'] = Storage::url($videoPath);
            }

            // Gérer l'upload de la miniature
            if ($request->hasFile('thumbnail_file')) {
                $thumbnailPath = $request->file('thumbnail_file')->store('thumbnails/admin', 'public');
                $validated['thumbnail'] = Storage::url($thumbnailPath);
            } else {
                // Générer une miniature par défaut
                $validated['thumbnail'] = '/placeholder-video.jpg';
            }

            // Ajouter les champs spécifiques admin
            $validated['uploader_id'] = auth()->id();
            $validated['is_admin_video'] = true;
            $validated['is_published'] = $validated['publish_immediately'] ?? false;
            $validated['views'] = 0;
            $validated['students_count'] = 0;

            // Créer la vidéo
            $video = Video::create($validated);

            // Charger les relations
            $video->load(['creator', 'likes', 'comments']);

            DB::commit();

            return response()->json([
                'message' => 'Vidéo créée avec succès',
                'video' => $video
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de la vidéo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une vidéo spécifique
     */
    public function show($id): JsonResponse
    {
        $this->ensureAdmin();

        $video = Video::with(['creator', 'likes', 'comments', 'tags'])
                   ->findOrFail($id);

        return response()->json($video);
    }

    /**
     * Mettre à jour une vidéo
     */
    public function update(Request $request, $id): JsonResponse
    {
        $this->ensureAdmin();

        $video = Video::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:2000',
            'category' => 'sometimes|required|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'learning_objectives' => 'nullable|array',
            'learning_objectives.*' => 'string|max:255',
            'visibility' => 'sometimes|required|in:private,public,unlisted',
            'duration' => 'sometimes|required|string|max:20',
            'allow_comments' => 'sometimes|boolean',
            'publish_immediately' => 'sometimes|boolean',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:102400',
            'thumbnail_file' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            DB::beginTransaction();

            // Gérer l'upload de la nouvelle vidéo si présente
            if ($request->hasFile('video_file')) {
                // Supprimer l'ancienne vidéo
                if ($video->video_url && str_contains($video->video_url, 'videos/')) {
                    $oldVideoPath = str_replace(Storage::url(''), '', $video->video_url);
                    Storage::disk('public')->delete($oldVideoPath);
                }

                $videoPath = $request->file('video_file')->store('videos/admin', 'public');
                $validated['video_url'] = Storage::url($videoPath);
            }

            // Gérer l'upload de la nouvelle miniature si présente
            if ($request->hasFile('thumbnail_file')) {
                // Supprimer l'ancienne miniature
                if ($video->thumbnail && str_contains($video->thumbnail, 'thumbnails/')) {
                    $oldThumbnailPath = str_replace(Storage::url(''), '', $video->thumbnail);
                    Storage::disk('public')->delete($oldThumbnailPath);
                }

                $thumbnailPath = $request->file('thumbnail_file')->store('thumbnails/admin', 'public');
                $validated['thumbnail'] = Storage::url($thumbnailPath);
            }

            // Gérer la publication immédiate
            if (isset($validated['publish_immediately'])) {
                $validated['is_published'] = $validated['publish_immediately'];
            }

            $video->update($validated);

            // Recharger les relations
            $video->load(['creator', 'likes', 'comments']);

            DB::commit();

            return response()->json([
                'message' => 'Vidéo mise à jour avec succès',
                'video' => $video
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la vidéo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une vidéo
     */
    public function destroy($id): JsonResponse
    {
        $this->ensureAdmin();

        $video = Video::findOrFail($id);

        try {
            DB::beginTransaction();

            // Supprimer les fichiers associés
            if ($video->video_url && str_contains($video->video_url, 'videos/')) {
                $videoPath = str_replace(Storage::url(''), '', $video->video_url);
                Storage::disk('public')->delete($videoPath);
            }

            if ($video->thumbnail && str_contains($video->thumbnail, 'thumbnails/')) {
                $thumbnailPath = str_replace(Storage::url(''), '', $video->thumbnail);
                Storage::disk('public')->delete($thumbnailPath);
            }

            // Supprimer les relations
            $video->likes()->delete();
            $video->comments()->delete();

            // Supprimer la vidéo
            $video->delete();

            DB::commit();

            return response()->json([
                'message' => 'Vidéo supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la suppression de la vidéo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Action en masse sur les vidéos
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'video_ids' => 'required|array',
            'video_ids.*' => 'integer|exists:videos,id',
            'action' => 'required|in:publish,unpublish,delete',
        ]);

        $videoIds = $validated['video_ids'];
        $action = $validated['action'];

        try {
            DB::beginTransaction();

            switch ($action) {
                case 'publish':
                    Video::whereIn('id', $videoIds)->update(['is_published' => true]);
                    $message = 'Vidéos publiées avec succès';
                    break;

                case 'unpublish':
                    Video::whereIn('id', $videoIds)->update(['is_published' => false]);
                    $message = 'Vidéos dépubliées avec succès';
                    break;

                case 'delete':
                    // Supprimer les fichiers et relations
                    $videos = Video::whereIn('id', $videoIds)->get();
                    
                    foreach ($videos as $video) {
                        if ($video->video_url && str_contains($video->video_url, 'videos/')) {
                            $videoPath = str_replace(Storage::url(''), '', $video->video_url);
                            Storage::disk('public')->delete($videoPath);
                        }
                        if ($video->thumbnail && str_contains($video->thumbnail, 'thumbnails/')) {
                            $thumbnailPath = str_replace(Storage::url(''), '', $video->thumbnail);
                            Storage::disk('public')->delete($thumbnailPath);
                        }
                        $video->likes()->delete();
                        $video->comments()->delete();
                    }
                    
                    Video::whereIn('id', $videoIds)->delete();
                    $message = 'Vidéos supprimées avec succès';
                    break;
            }

            DB::commit();

            return response()->json([
                'message' => $message,
                'affected_count' => count($videoIds)
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
     * Statistiques des vidéos
     */
    public function stats(): JsonResponse
    {
        $this->ensureAdmin();

        $stats = [
            'total_videos' => Video::count(),
            'published_videos' => Video::where('is_published', true)->count(),
            'draft_videos' => Video::where('is_published', false)->count(),
            'admin_videos' => Video::where('is_admin_video', true)->count(),
            'creator_videos' => Video::where('is_admin_video', false)->count(),
            'by_category' => Video::selectRaw('category, COUNT(*) as count')
                               ->groupBy('category')
                               ->orderByDesc('count')
                               ->get(),
            'total_views' => Video::sum('views') ?? 0,
            'total_likes' => Video::withCount('likes')->get()->sum('likes_count'),
            'recent_uploads' => Video::where('created_at', '>=', now()->subDays(30))->count(),
            'monthly_growth' => $this->calculateMonthlyGrowth(),
        ];

        return response()->json($stats);
    }

    /**
     * Calculer la croissance mensuelle
     */
    private function calculateMonthlyGrowth(): array
    {
        $currentMonth = Video::whereMonth('created_at', now()->month)
                             ->whereYear('created_at', now()->year)
                             ->count();

        $lastMonth = Video::whereMonth('created_at', now()->subMonth()->month)
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
