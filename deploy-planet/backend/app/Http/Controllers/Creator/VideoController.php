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
                        'thumbnail' => $video->thumbnail,
                        'url' => $video->url,
                        'duration' => $video->duration ?: '00:00',
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
                'video' => 'required|file|max:512000',
                'visibility' => 'required|in:public,private',
            ]);

            $path = $request->file('video')->store('videos', 'public');

            $video = Video::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'description' => $request->description ?? '',
                'url' => $path,
                'category' => $request->category ?? 'General',
                'visibility' => $request->visibility,
                'uploader_id' => $user->id,
                'company_id' => $user->company_id,
                'duration' => $request->duration ?? '00:00',
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

            return response()->json($video);
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
                'visibility' => 'sometimes|in:public,private',
            ]);

            $video->update($request->only(['title', 'description', 'visibility']));

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
            if ($video->url) {
                Storage::disk('public')->delete($video->url);
            }

            $video->delete();

            return response()->json(['message' => 'Vidéo supprimée']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
