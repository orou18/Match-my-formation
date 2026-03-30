<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail_url,
                        'url' => $video->video_url,
                        'source_type' => $video->source_type,
                        'external_url' => $video->external_url,
                        'duration' => $video->duration,
                        'views' => $video->views ?: 0,
                        'likes' => $video->likes ?: 0,
                        'comments' => $video->comments ?: 0,
                        'shares' => $video->shares ?: 0,
                        'status' => $video->visibility === 'public' ? 'published' : 'draft',
                        'visibility' => $video->visibility,
                        'created_at' => $video->created_at,
                        'updated_at' => $video->updated_at,
                    ];
                });

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
                'external_url' => 'nullable|url',
                'visibility' => 'required|in:public,private,unlisted',
            ]);

            $hasUpload = $request->hasFile('video');
            $hasExternalUrl = filled($request->external_url);

            if ($hasUpload === $hasExternalUrl) {
                return response()->json(['message' => 'Fournissez soit un fichier, soit une URL externe.'], 422);
            }

            $path = $hasUpload ? $request->file('video')->store('videos', 'public') : null;
            $externalUrl = $hasExternalUrl ? $request->string('external_url')->toString() : null;

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
                'thumbnail' => $request->thumbnail,
                'duration' => $request->integer('duration') ?: null,
                'allow_comments' => filter_var($request->input('allow_comments', true), FILTER_VALIDATE_BOOLEAN),
                'published_at' => in_array($request->visibility, ['public', 'unlisted'], true) ? now() : null,
            ]);

            return response()->json(['message' => 'Succès', 'video' => $video], 201);
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

            return response()->json([
                ...$video->toArray(),
                'video_url' => $video->video_url,
                'thumbnail_url' => $video->thumbnail_url,
            ]);
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
                'external_url' => 'sometimes|nullable|url',
            ]);

            $payload = $request->only(['title', 'description', 'visibility', 'external_url', 'thumbnail']);
            if (array_key_exists('external_url', $payload)) {
                $payload['source_type'] = filled($payload['external_url']) ? 'external' : 'upload';
                $payload['provider'] = filled($payload['external_url']) ? $this->detectProvider($payload['external_url']) : 'direct';
            }
            if (array_key_exists('visibility', $payload) && in_array($payload['visibility'], ['public', 'unlisted'], true) && !$video->published_at) {
                $payload['published_at'] = now();
            }

            $video->update($payload);

            return response()->json(['message' => 'Vidéo mise à jour', 'video' => $video]);
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

    private function detectProvider(string $url): string
    {
        return match (true) {
            str_contains($url, 'youtube.com'), str_contains($url, 'youtu.be') => 'youtube',
            str_contains($url, 'vimeo.com') => 'vimeo',
            default => 'external',
        };
    }
}
