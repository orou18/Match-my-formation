<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
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
                        'type' => 'video',
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail,
                        'views' => $video->views ?: 0,
                        'likes' => $video->likes ?: 0,
                        'comments' => $video->comments ?: 0,
                        'shares' => $video->shares ?: 0,
                        'status' => $video->visibility === 'public' ? 'published' : 'draft',
                        'created_at' => $video->created_at,
                        'updated_at' => $video->updated_at,
                        'performance' => [
                            'views_change' => rand(-10, 25), // Simulé
                            'likes_change' => rand(-5, 15), // Simulé
                            'engagement_rate' => rand(2, 8), // Simulé
                        ],
                    ];
                });

            return response()->json($videos);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
