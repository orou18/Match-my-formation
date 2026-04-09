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
                ->where('is_published', true)
                ->where('visibility', 'public')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'thumbnail' => $video->thumbnail,
                        'video_url' => $video->video_url,
                        'duration' => $video->duration,
                        'views' => $video->views ?? 0,
                        'likes' => $video->likes ?? 0,
                        'students_count' => $video->students_count ?? rand(100, 5000),
                        'rating' => $video->rating ?? 4.5,
                        'tags' => $video->tags ?? [],
                        'category' => $video->category ?? 'general',
                        'difficulty_level' => $video->difficulty_level ?? 'beginner',
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
                        'learning_objectives' => $video->learning_objectives ?? [],
                        'target_audience' => $video->target_audience ?? [],
                        'prerequisites' => $video->prerequisites ?? [],
                        'certificate_available' => $video->certificate_available ?? false,
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
                ->where('is_published', true)
                ->where('visibility', 'public')
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
                    'thumbnail' => $video->thumbnail,
                    'video_url' => $video->video_url,
                    'duration' => $video->duration,
                    'views' => ($video->views ?? 0) + 1,
                    'likes' => $video->likes ?? 0,
                    'students_count' => $video->students_count ?? rand(100, 5000),
                    'rating' => $video->rating ?? 4.5,
                    'tags' => $video->tags ?? [],
                    'category' => $video->category ?? 'general',
                    'difficulty_level' => $video->difficulty_level ?? 'beginner',
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
                    'learning_objectives' => $video->learning_objectives ?? [],
                    'target_audience' => $video->target_audience ?? [],
                    'prerequisites' => $video->prerequisites ?? [],
                    'certificate_available' => $video->certificate_available ?? false,
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
                ->where('is_published', true)
                ->where('visibility', 'public');

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
                        'thumbnail' => $video->thumbnail,
                        'video_url' => $video->video_url,
                        'duration' => $video->duration,
                        'views' => $video->views ?? 0,
                        'likes' => $video->likes ?? 0,
                        'students_count' => $video->students_count ?? rand(100, 5000),
                        'rating' => $video->rating ?? 4.5,
                        'tags' => $video->tags ?? [],
                        'category' => $video->category ?? 'general',
                        'difficulty_level' => $video->difficulty_level ?? 'beginner',
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
}
