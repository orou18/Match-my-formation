<?php

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicVideoController extends Controller
{
    /**
     * Récupère toutes les vidéos publiques pour les étudiants
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Récupérer les vidéos publiques avec leurs créateurs
            $videos = Video::with(['creator:id,name,avatar'])
                ->where('visibility', 'public')
                ->whereNotNull('published_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail_url,
                        'video_url' => $video->video_url,
                        'duration' => $this->formatDuration($video->duration),
                        'views' => $video->views ?? 0,
                        'likes' => $video->likes ?? 0,
                        'students_count' => $video->views ?? 0,
                        'rating' => 0,
                        'tags' => [],
                        'category' => $video->category ?? 'general',
                        'difficulty_level' => 'beginner',
                        'language' => 'fr',
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
                        'is_free' => true,
                        'price' => 0,
                        'learning_objectives' => [],
                        'target_audience' => [],
                        'prerequisites' => [],
                        'certificate_available' => false,
                    ];
                });

            return response()->json([
                'success' => true,
                'videos' => $videos,
                'total' => $videos->count(),
                'message' => 'Vidéos publiques récupérées avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des vidéos publiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère une vidéo publique spécifique
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $video = Video::with(['creator:id,name,avatar'])
                ->where('id', $id)
                ->where('visibility', 'public')
                ->whereNotNull('published_at')
                ->first();

            if (!$video) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vidéo non trouvée ou non accessible'
                ], 404);
            }

            // Incrémenter le nombre de vues
            $video->increment('views');

            return response()->json([
                'success' => true,
                'video' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'thumbnail' => $video->thumbnail_url,
                    'video_url' => $video->video_url,
                    'duration' => $this->formatDuration($video->duration),
                    'views' => ($video->views ?? 0) + 1,
                    'likes' => $video->likes ?? 0,
                    'students_count' => ($video->views ?? 0) + 1,
                    'rating' => 0,
                    'tags' => [],
                    'category' => $video->category ?? 'general',
                    'difficulty_level' => 'beginner',
                    'language' => 'fr',
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
                    'is_free' => true,
                    'price' => 0,
                    'learning_objectives' => [],
                    'target_audience' => [],
                    'prerequisites' => [],
                    'certificate_available' => false,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la vidéo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recherche de vidéos publiques
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            $category = $request->get('category', 'all');
            $difficulty = $request->get('difficulty', 'all');
            $limit = min($request->get('limit', 20), 50);

            $videosQuery = Video::with(['creator:id,name,avatar'])
                ->where('visibility', 'public');
                $videosQuery->whereNotNull('published_at');

            // Recherche par texte
            if (!empty($query)) {
                $videosQuery->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%")
                      ->orWhere('tags', 'LIKE', "%{$query}%");
                });
            }

            // Filtrer par catégorie
            if ($category !== 'all') {
                $videosQuery->where('category', $category);
            }

            // Filtrer par difficulté
            if ($difficulty !== 'all') {
                $videosQuery->where('difficulty_level', $difficulty);
            }

            $videos = $videosQuery->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail_url,
                        'video_url' => $video->video_url,
                        'duration' => $this->formatDuration($video->duration),
                        'views' => $video->views ?? 0,
                        'likes' => $video->likes ?? 0,
                        'students_count' => $video->views ?? 0,
                        'rating' => 0,
                        'tags' => [],
                        'category' => $video->category ?? 'general',
                        'difficulty_level' => 'beginner',
                        'language' => 'fr',
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
                        'is_free' => true,
                        'price' => 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'videos' => $videos,
                'total' => $videos->count(),
                'query' => $query,
                'filters' => [
                    'category' => $category,
                    'difficulty' => $difficulty,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche: ' . $e->getMessage()
            ], 500);
        }
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
}
