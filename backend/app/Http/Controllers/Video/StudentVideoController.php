<?php

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentVideoController extends Controller
{
    /**
     * Obtenir toutes les vidéos publiques (créateurs + admin)
     */
    public function getAllPublicVideos(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 20);
            $category = $request->get('category', 'all');
            $search = $request->get('search', '');
            $sortBy = $request->get('sort', 'recent');

            $query = Video::with(['creator:id,name,email,avatar,role'])
                ->where('is_published', true)
                ->where('visibility', 'public');

            if ($category !== 'all') {
                $query->where('category', $category);
            }

            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            switch ($sortBy) {
                case 'popular':
                    $query->orderBy('views', 'desc');
                    break;
                case 'rating':
                    $query->orderBy('rating', 'desc');
                    break;
                case 'duration':
                    $query->orderByRaw('TIME_TO_SEC(duration) asc');
                    break;
                case 'title':
                    $query->orderBy('title', 'asc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $videos = $query->paginate($limit, ['*'], 'page', $page);

            $creatorVideos = $videos->getCollection()->filter(function($video) {
                return $video->creator && $video->creator->role === 'creator';
            })->values();

            $adminVideos = $videos->getCollection()->filter(function($video) {
                return $video->creator && $video->creator->role === 'admin';
            })->values();

            $allVideos = $videos->getCollection();

            $stats = [
                'totalVideos' => $allVideos->count(),
                'creatorVideos' => $creatorVideos->count(),
                'adminVideos' => $adminVideos->count(),
                'totalViews' => $allVideos->sum('views'),
                'averageRating' => $allVideos->count() > 0 
                    ? round($allVideos->avg('rating'), 1) 
                    : 0,
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'creatorVideos' => $creatorVideos->toArray(),
                    'adminVideos' => $adminVideos->toArray(),
                    'allVideos' => $allVideos->toArray(),
                    'pagination' => [
                        'current_page' => $videos->currentPage(),
                        'total_pages' => $videos->lastPage(),
                        'total_items' => $videos->total(),
                        'per_page' => $videos->perPage(),
                    ],
                    'stats' => $stats,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter une URL de vidéo à une vidéo existante
     */
    public function addVideoUrl(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $video = Video::where('id', $id)
                ->where(function($query) use ($user) {
                    $query->where('uploader_id', $user->id)
                          ->orWhereHas('creator', function($q) use ($user) {
                              $q->where('id', $user->id);
                          });
                })
                ->firstOrFail();

            $validated = $request->validate([
                'video_url' => 'required|url',
                'video_type' => 'required|in:upload,url',
            ]);

            if (!$this->isValidVideoUrl($validated['video_url'])) {
                return response()->json([
                    'success' => false,
                    'error' => 'URL de vidéo invalide'
                ], 400);
            }

            $video->update([
                'video_url' => $validated['video_url'],
                'video_type' => $validated['video_type'],
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'URL de vidéo ajoutée avec succès',
                'data' => [
                    'id' => $video->id,
                    'video_url' => $video->video_url,
                    'video_type' => $video->video_type,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valider si une URL de vidéo est valide
     */
    private function isValidVideoUrl($url)
    {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        $allowedDomains = [
            'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
            'twitch.tv', 'facebook.com', 'instagram.com', 'twitter.com'
        ];

        $domain = parse_url($url, PHP_URL_HOST);
        if (!$domain) {
            return false;
        }

        foreach ($allowedDomains as $allowedDomain) {
            if (str_contains($domain, $allowedDomain)) {
                return true;
            }
        }

        if (str_contains($url, request()->getHost())) {
            return true;
        }

        return false;
    }
}
