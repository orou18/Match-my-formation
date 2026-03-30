<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Video;
use App\Models\VideoLike;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{
    /**
     * Liste des vidéos (Auth requis)
     */
    public function index()
    {
        try {
            $user = Auth::user();

            // Retourner les vidéos publiques par défaut si pas d'utilisateur
            if (!$user) {
                return response()->json(
                    Video::where('visibility', 'public')
                        ->orWhere('visibility', 'unlisted')
                        ->latest()
                        ->limit(20)
                        ->get()
                        ->map(fn (Video $video) => $this->serializeVideo($video))
                );
            }

            // Admin voit toutes les vidéos
            if ($user->role === 'admin') {
                return response()->json(
                    Video::latest()
                        ->limit(20)
                        ->get()
                        ->map(fn (Video $video) => $this->serializeVideo($video))
                );
            }

            // Utilisateur normal voit les vidéos publiques
            return response()->json(
                Video::where('visibility', 'public')
                    ->orWhere('visibility', 'unlisted')
                    ->latest()
                    ->limit(20)
                    ->get()
                    ->map(fn (Video $video) => $this->serializeVideo($video))
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'nullable|file|max:512000',
            'external_url' => 'nullable|url',
            'visibility' => 'required|in:public,private,unlisted',
        ]);

        try {
            $user = Auth::user();
            $hasUpload = $request->hasFile('video');
            $hasExternalUrl = filled($request->external_url);

            if ($hasUpload === $hasExternalUrl) {
                return response()->json([
                    'message' => 'Vous devez fournir soit un fichier vidéo, soit une URL externe.',
                ], 422);
            }

            $sourceType = $hasUpload ? 'upload' : 'external';
            $path = $hasUpload ? $request->file('video')->store('videos', 'public') : null;
            $externalUrl = $hasExternalUrl ? $request->string('external_url')->toString() : null;
            $provider = $this->detectProvider($externalUrl);

            $video = Video::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'description' => $request->description ?? '',
                'url' => $path,
                'external_url' => $externalUrl,
                'source_type' => $sourceType,
                'provider' => $provider,
                'category' => $request->category ?? 'General',
                'visibility' => $request->visibility,
                'allow_comments' => filter_var($request->input('allow_comments', true), FILTER_VALIDATE_BOOLEAN),
                'uploader_id' => $user->id,
                'thumbnail' => $request->thumbnail,
                'duration' => $request->integer('duration') ?: null,
                'published_at' => in_array($request->visibility, ['public', 'unlisted'], true) ? now() : null,
            ]);

            return response()->json(['message' => 'Succès', 'video' => $this->serializeVideo($video->fresh())], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $video = Video::with(['uploader:id,name,avatar', 'chatMessages'])->findOrFail($id);

        return response()->json($this->serializeVideo($video));
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        if ($video->source_type === 'upload' && $video->url) {
            Storage::disk($video->storage_disk ?: 'public')->delete($video->url);
        }
        $video->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    /**
     * VERSION DE TEST RADICALE pour indexPublic
     * On retire TOUT ce qui pourrait faire boucler (Eloquent, relations, etc.)
     */
    public function indexPublic()
    {
        // On utilise un try/catch pour attraper l'erreur avant le crash PHP
        try {
            // Test avec un retour simple pour voir si le serveur survit
            $videos = Video::select('id', 'title', 'slug', 'url')
                        ->where('visibility', 'public')
                        ->latest()
                        ->limit(5)
                        ->get();

            return response()->json($videos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Boucle détectée'], 500);
        }
    }

    public function like(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || $user instanceof Employee) {
            return response()->json(['message' => 'Authentification requise.'], 401);
        }

        $video = Video::findOrFail($id);

        VideoLike::firstOrCreate([
            'video_id' => $video->id,
            'user_id' => $user->id,
        ]);

        $video->update(['likes' => $video->likes()->count()]);

        return response()->json([
            'message' => 'Like enregistré',
            'likes' => $video->likes,
        ]);
    }

    public function unlike(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || $user instanceof Employee) {
            return response()->json(['message' => 'Authentification requise.'], 401);
        }

        $video = Video::findOrFail($id);
        $video->likes()->where('user_id', $user->id)->delete();
        $video->update(['likes' => $video->likes()->count()]);

        return response()->json([
            'message' => 'Like supprimé',
            'likes' => $video->likes,
        ]);
    }

    public function comment(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || $user instanceof Employee) {
            return response()->json(['message' => 'Authentification requise.'], 401);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $video = Video::findOrFail($id);

        if (!$video->allow_comments) {
            return response()->json(['message' => 'Les commentaires sont désactivés pour cette vidéo.'], 403);
        }

        $comment = ChatMessage::create([
            'video_id' => $video->id,
            'user_id' => $user->id,
            'message' => $validated['content'],
            'is_question' => false,
            'status' => 'answered',
        ]);

        $video->increment('comments');

        return response()->json([
            'id' => $comment->id,
            'content' => $comment->message,
            'created_at' => $comment->created_at->toISOString(),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'comments_count' => $video->fresh()->comments,
        ], 201);
    }

    private function detectProvider(?string $url): string
    {
        if (!$url) {
            return 'direct';
        }

        return match (true) {
            str_contains($url, 'youtube.com'), str_contains($url, 'youtu.be') => 'youtube',
            str_contains($url, 'vimeo.com') => 'vimeo',
            default => 'external',
        };
    }

    private function serializeVideo(Video $video): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'slug' => $video->slug,
            'description' => $video->description,
            'thumbnail' => $video->thumbnail_url,
            'video_url' => $video->video_url,
            'source_type' => $video->source_type,
            'external_url' => $video->external_url,
            'provider' => $video->provider,
            'category' => $video->category,
            'visibility' => $video->visibility,
            'allow_comments' => $video->allow_comments,
            'duration' => $video->duration,
            'views' => $video->views,
            'likes' => $video->likes,
            'comments' => $video->comments,
            'shares' => $video->shares,
            'created_at' => $video->created_at,
            'updated_at' => $video->updated_at,
        ];
    }
}
