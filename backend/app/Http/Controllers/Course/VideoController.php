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
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return response()->json(Video::with(['company', 'uploader'])->latest()->get());
        }

        if (in_array($user->role, ['partner', 'creator'])) {
            return response()->json(
                Video::where('company_id', $user->company_id)
                    ->with('uploader')
                    ->latest()
                    ->get()
            );
        }

        return response()->json(Video::where('visibility', 'public')->latest()->get());
    }

    public function store(Request $request)
    {
        // On valide 'video' pour correspondre au frontend
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'required|file|mimetypes:video/mp4,video/mpeg,video/quicktime|max:512000', 
            'category' => 'nullable|string',
            'visibility' => 'required|in:public,private',
            'module_id' => 'nullable|exists:modules,id',
        ]);

        try {
            $user = Auth::user();
            
            // Stockage
            $path = $request->file('video')->store('videos', 'public');

            $video = Video::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'description' => $request->description,
                'url' => $path,
                'category' => $request->category ?? 'General',
                'visibility' => $request->visibility,
                'uploader_id' => $user->id,
                'company_id' => $user->company_id,
                'module_id' => $request->module_id,
            ]);

            return response()->json([
                'message' => 'Vidéo uploadée avec succès',
                'video' => $video
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'upload',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $video = Video::with(['uploader', 'company', 'module'])->findOrFail($id);
        $video->increment('views');
        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        if (Storage::disk('public')->exists($video->url)) {
            Storage::disk('public')->delete($video->url);
        }
        $video->delete();
        return response()->json(['message' => 'Vidéo supprimée']);
    }

    public function indexPublic()
    {
        return response()->json(Video::where('visibility', 'public')->with('company')->latest()->take(10)->get());
    }
}