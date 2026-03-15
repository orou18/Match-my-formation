<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Video;
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
                        ->latest()
                        ->limit(20)
                        ->get()
                );
            }

            // Admin voit toutes les vidéos
            if ($user->role === 'admin') {
                return response()->json(Video::latest()->limit(20)->get());
            }

            // Utilisateur normal voit les vidéos publiques
            return response()->json(
                Video::where('visibility', 'public')
                    ->latest()
                    ->limit(20)
                    ->get()
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'required|file|max:512000',
            'visibility' => 'required|in:public,private',
        ]);

        try {
            $user = Auth::user();
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
            ]);

            return response()->json(['message' => 'Succès', 'video' => $video], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $video = Video::findOrFail($id);
        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
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
}
