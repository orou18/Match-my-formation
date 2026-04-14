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
                            'views_change' => 0,
                            'likes_change' => 0,
                            'engagement_rate' => ($video->views ?? 0) > 0
                                ? round(((($video->likes ?? 0) + ($video->comments ?? 0)) / max($video->views, 1)) * 100, 2)
                                : 0,
                        ],
                    ];
                });

            return response()->json($videos);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
