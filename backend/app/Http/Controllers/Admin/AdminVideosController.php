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

        $query = Video::with(['creator', 'likes']);

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
            $isPublished
                ? $query->whereNotNull('published_at')
                : $query->whereNull('published_at');
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
                'tags' => [],
                'learning_objectives' => $video->learning_objectives ?? [],
                'visibility' => $video->visibility,
                'duration' => $this->formatDuration($video->duration),
                'allow_comments' => $video->allow_comments,
                'publish_immediately' => $video->published_at !== null,
                'is_admin_video' => $video->creator?->role === 'admin',
                'is_published' => $video->published_at !== null,
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
                'comments' => (int) ($video->comments ?? 0),
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
            'visibility' => 'required|in:private,public,unlisted',
            'duration' => 'nullable',
            'allow_comments' => 'boolean',
            'publish_immediately' => 'boolean',
            'video' => 'nullable|file|max:512000',
            'video_file' => 'nullable|file|max:512000',
            'thumbnail' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'thumbnail_file' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'external_url' => 'nullable|string|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $upload = $request->file('video') ?? $request->file('video_file');
            $hasUpload = $upload !== null;
            $hasExternalUrl = filled($request->external_url);

            if ($hasUpload === $hasExternalUrl) {
                return response()->json(['message' => 'Fournissez soit un fichier, soit une URL externe.'], 422);
            }

            $videoPath = $hasUpload ? $upload->store('videos/admin', 'public') : null;

            // Gérer l'upload de la miniature
            $thumbnailUpload = $request->file('thumbnail') ?? $request->file('thumbnail_file');
            $thumbnailPath = $thumbnailUpload ? $thumbnailUpload->store('thumbnails/admin', 'public') : null;

            $video = Video::create([
                'title' => $validated['title'],
                'slug' => \Illuminate\Support\Str::slug($validated['title']) . '-' . uniqid(),
                'description' => $validated['description'],
                'category' => $validated['category'],
                'visibility' => $validated['visibility'],
                'allow_comments' => (bool) ($validated['allow_comments'] ?? true),
                'duration' => $this->normalizeDuration($validated['duration'] ?? null),
                'uploader_id' => auth()->id(),
                'source_type' => $hasUpload ? 'upload' : 'external',
                'url' => $videoPath,
                'external_url' => $hasExternalUrl ? $request->string('external_url')->toString() : null,
                'provider' => $hasUpload ? 'direct' : 'external',
                'thumbnail' => $thumbnailPath,
                'published_at' => ($validated['publish_immediately'] ?? $validated['visibility'] !== 'private') ? now() : null,
            ]);

            $video->load(['creator', 'likes']);

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

        $video = Video::with(['creator', 'likes'])
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
            'visibility' => 'sometimes|required|in:private,public,unlisted',
            'duration' => 'sometimes|nullable',
            'allow_comments' => 'sometimes|boolean',
            'publish_immediately' => 'sometimes|boolean',
            'video' => 'nullable|file|max:512000',
            'video_file' => 'nullable|file|max:512000',
            'thumbnail' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'thumbnail_file' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'external_url' => 'sometimes|nullable|string|max:2048',
        ]);

        try {
            DB::beginTransaction();

            // Gérer l'upload de la nouvelle vidéo si présente
            $upload = $request->file('video') ?? $request->file('video_file');
            if ($upload) {
                // Supprimer l'ancienne vidéo
                if ($video->source_type === 'upload' && $video->url) {
                    Storage::disk($video->storage_disk ?: 'public')->delete($video->url);
                }

                $validated['url'] = $upload->store('videos/admin', 'public');
                $validated['source_type'] = 'upload';
                $validated['external_url'] = null;
            }

            // Gérer l'upload de la nouvelle miniature si présente
            $thumbnailUpload = $request->file('thumbnail') ?? $request->file('thumbnail_file');
            if ($thumbnailUpload) {
                // Supprimer l'ancienne miniature
                if ($video->thumbnail && str_contains($video->thumbnail, 'thumbnails/')) {
                    $oldThumbnailPath = str_replace(Storage::url(''), '', $video->thumbnail);
                    Storage::disk('public')->delete($oldThumbnailPath);
                }

                $thumbnailPath = $thumbnailUpload->store('thumbnails/admin', 'public');
                $validated['thumbnail'] = $thumbnailPath;
            }

            if (array_key_exists('duration', $validated)) {
                $validated['duration'] = $this->normalizeDuration($validated['duration']);
            }

            if (isset($validated['publish_immediately'])) {
                $validated['published_at'] = $validated['publish_immediately'] ? now() : null;
                unset($validated['publish_immediately']);
            }
            unset($validated['video'], $validated['video_file'], $validated['thumbnail_file']);

            $video->update($validated);

            // Recharger les relations
            $video->load(['creator', 'likes']);

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
                    Video::whereIn('id', $videoIds)->update(['published_at' => now(), 'visibility' => 'public']);
                    $message = 'Vidéos publiées avec succès';
                    break;

                case 'unpublish':
                    Video::whereIn('id', $videoIds)->update(['published_at' => null, 'visibility' => 'private']);
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
            'published_videos' => Video::whereNotNull('published_at')->count(),
            'draft_videos' => Video::whereNull('published_at')->count(),
            'admin_videos' => Video::whereHas('creator', fn ($query) => $query->where('role', 'admin'))->count(),
            'creator_videos' => Video::whereHas('creator', fn ($query) => $query->where('role', 'creator'))->count(),
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

    private function normalizeDuration(mixed $duration): ?int
    {
        if ($duration === null || $duration === '') {
            return null;
        }

        if (is_numeric($duration)) {
            return (int) $duration;
        }

        if (!is_string($duration)) {
            return null;
        }

        $parts = array_map('intval', explode(':', $duration));
        if (count($parts) === 2) {
            return ($parts[0] * 60) + $parts[1];
        }
        if (count($parts) === 3) {
            return ($parts[0] * 3600) + ($parts[1] * 60) + $parts[2];
        }

        return null;
    }

    private function formatDuration(?int $duration): string
    {
        if (!$duration || $duration < 1) {
            return '00:00';
        }

        $hours = intdiv($duration, 3600);
        $minutes = intdiv($duration % 3600, 60);
        $seconds = $duration % 60;

        return $hours > 0
            ? sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds)
            : sprintf('%02d:%02d', $minutes, $seconds);
    }
}
