<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $videos = Video::where('uploader_id', $user->id)
                ->latest()
                ->get()
                ->map(fn (Video $video) => $this->serializeVideo($video))
                ->values();

            return response()->json($videos);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'video' => 'nullable|file|max:512000',
                'video_file' => 'nullable|file|max:512000',
                'external_url' => 'nullable|url',
                'visibility' => 'required|in:public,private,unlisted',
            ]);

            $upload = $request->file('video') ?? $request->file('video_file');
            $hasUpload = $upload !== null;
            $hasExternalUrl = filled($request->external_url);

            if ($hasUpload === $hasExternalUrl) {
                return response()->json(['message' => 'Fournissez soit un fichier, soit une URL externe.'], 422);
            }

            $path = $hasUpload ? $upload->store('videos', 'public') : null;
            $externalUrl = $hasExternalUrl ? $request->string('external_url')->toString() : null;
            $thumbnail = $this->resolveThumbnail($request);

            $video = Video::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'description' => $request->description ?? '',
                'url' => $path,
                'external_url' => $externalUrl,
                'source_type' => $hasUpload ? 'upload' : 'external',
                'provider' => $externalUrl ? $this->detectProvider($externalUrl) : 'direct',
                'category' => $request->category ?? 'General',
                'visibility' => $request->visibility,
                'uploader_id' => $user->id,
                'thumbnail' => $thumbnail,
                'duration' => $this->normalizeDuration($request->input('duration')),
                'allow_comments' => filter_var($request->input('allow_comments', true), FILTER_VALIDATE_BOOLEAN),
                'published_at' => in_array($request->visibility, ['public', 'unlisted'], true) ? now() : null,
            ]);

            return response()->json([
                'message' => 'Succès',
                'video' => $this->serializeVideo($video->fresh()),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $video = Video::where('id', $id)
                ->where('uploader_id', $user->id)
                ->firstOrFail();

            return response()->json($this->serializeVideo($video));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $video = Video::where('id', $id)
                ->where('uploader_id', $user->id)
                ->firstOrFail();

            $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|nullable|string',
                'visibility' => 'sometimes|in:public,private,unlisted',
                'status' => 'sometimes|in:published,draft,processing,archived,unlisted',
                'external_url' => 'sometimes|nullable|url',
            ]);

            $payload = $request->only(['title', 'description', 'visibility', 'external_url', 'thumbnail']);

            if ($request->filled('status') && !array_key_exists('visibility', $payload)) {
                $payload['visibility'] = match ($request->input('status')) {
                    'published' => 'public',
                    'unlisted' => 'unlisted',
                    default => 'private',
                };
            }

            if ($request->hasFile('thumbnail') || filled($request->input('selected_thumbnail'))) {
                $payload['thumbnail'] = $this->resolveThumbnail($request);
            }

            if (array_key_exists('external_url', $payload)) {
                $payload['source_type'] = filled($payload['external_url']) ? 'external' : 'upload';
                $payload['provider'] = filled($payload['external_url']) ? $this->detectProvider($payload['external_url']) : 'direct';
            }
            if (array_key_exists('visibility', $payload) && in_array($payload['visibility'], ['public', 'unlisted'], true) && !$video->published_at) {
                $payload['published_at'] = now();
            }
            if (array_key_exists('visibility', $payload) && $payload['visibility'] === 'private') {
                $payload['published_at'] = null;
            }

            $video->update($payload);

            return response()->json([
                'message' => 'Vidéo mise à jour',
                'video' => $this->serializeVideo($video->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $video = Video::where('id', $id)
                ->where('uploader_id', $user->id)
                ->firstOrFail();

            // Supprimer le fichier vidéo
            if ($video->source_type === 'upload' && $video->url) {
                Storage::disk($video->storage_disk ?: 'public')->delete($video->url);
            }

            $video->delete();

            return response()->json(['message' => 'Vidéo supprimée']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Récupérer les vidéos publiques (pour le dashboard étudiant)
     */
    public function publicVideos(Request $request)
    {
        try {
            $videos = Video::with(['creator:id,name,avatar'])
                ->where('visibility', 'public')
                ->whereNotNull('published_at')
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(fn (Video $video) => $this->serializePublicVideo($video))
                ->values();

            return response()->json([
                'success' => true,
                'videos' => $videos,
                'total' => $videos->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Sérialiser une vidéo pour l'API publique
     */
    private function serializePublicVideo(Video $video): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'thumbnail' => $video->thumbnail_url,
            'video_url' => $video->video_url,
            'duration' => $this->formatDuration($video->duration),
            'views' => (int) ($video->views ?? 0),
            'likes' => (int) ($video->likes ?? 0),
            'students_count' => (int) ($video->views ?? 0),
            'rating' => 0,
            'tags' => [],
            'category' => $video->category ?? 'general',
            'difficulty_level' => 'beginner',
            'language' => $video->language ?? 'fr',
            'created_at' => $video->created_at->toISOString(),
            'updated_at' => $video->updated_at->toISOString(),
            'creator' => $video->creator ? [
                'id' => $video->creator->id,
                'name' => $video->creator->name,
                'avatar' => $video->creator->avatar ?? '/avatars/default-creator.jpg',
            ] : [
                'id' => 1,
                'name' => 'Expert',
                'avatar' => '/avatars/default-creator.jpg',
            ],
            'is_free' => $video->is_free ?? true,
            'price' => $video->price ?? 0,
            'learning_objectives' => [],
            'target_audience' => [],
            'prerequisites' => [],
            'certificate_available' => false,
        ];
    }

    private function detectProvider(string $url): string
    {
        return match (true) {
            str_contains($url, 'youtube.com'), str_contains($url, 'youtu.be') => 'youtube',
            str_contains($url, 'vimeo.com') => 'vimeo',
            default => 'external',
        };
    }

    private function serializeVideo(Video $video): array
    {
        $status = match ($video->visibility) {
            'public' => 'published',
            'unlisted' => 'unlisted',
            default => 'draft',
        };

        return [
            'id' => (string) $video->id,
            'title' => $video->title,
            'description' => $video->description ?? '',
            'thumbnail' => $video->thumbnail_url,
            'thumbnail_url' => $video->thumbnail_url,
            'video_url' => $video->video_url,
            'url' => $video->video_url,
            'source_type' => $video->source_type,
            'external_url' => $video->external_url,
            'duration' => $this->formatDuration($video->duration),
            'duration_seconds' => (int) ($video->duration ?? 0),
            'views' => (int) ($video->views ?? 0),
            'likes' => (int) ($video->likes ?? 0),
            'comments' => (int) ($video->comments ?? 0),
            'shares' => (int) ($video->shares ?? 0),
            'students' => 0,
            'revenue' => 0,
            'status' => $status,
            'visibility' => $video->visibility,
            'is_published' => in_array($video->visibility, ['public', 'unlisted'], true),
            'category' => $video->category ?? 'General',
            'allow_comments' => (bool) $video->allow_comments,
            'created_at' => $video->created_at?->toISOString(),
            'updated_at' => $video->updated_at?->toISOString(),
            'createdAt' => $video->created_at?->toISOString(),
            'updatedAt' => $video->updated_at?->toISOString(),
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

        if ($hours > 0) {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        }

        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    private function resolveThumbnail(Request $request): ?string
    {
        if ($request->hasFile('thumbnail')) {
            return $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $selectedThumbnail = $request->input('selected_thumbnail');
        if (is_string($selectedThumbnail) && str_starts_with($selectedThumbnail, 'data:image/')) {
            return $this->storeBase64Thumbnail($selectedThumbnail);
        }

        $thumbnail = $request->input('thumbnail');
        return is_string($thumbnail) && $thumbnail !== '' ? $thumbnail : null;
    }

    private function storeBase64Thumbnail(string $value): ?string
    {
        if (!preg_match('/^data:image\/(\w+);base64,/', $value, $matches)) {
            return null;
        }

        $extension = strtolower($matches[1]);
        $data = substr($value, strpos($value, ',') + 1);
        $binary = base64_decode($data, true);

        if ($binary === false) {
            return null;
        }

        $path = 'thumbnails/' . Str::uuid() . '.' . $extension;
        Storage::disk('public')->put($path, $binary);

        return $path;
    }
}
