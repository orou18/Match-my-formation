<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Récupérer les vidéos publiques pour la page d'accueil
     */
    public function publicVideos()
    {
        // Données de test pour le développement
        $videos = [
            [
                'id' => 1,
                'title' => 'Introduction au Tourisme Durable',
                'description' => 'Découvrez les fondamentaux du tourisme écologique et les pratiques durables.',
                'thumbnail' => '/videos/video1-thumb.jpg',
                'duration' => '12:34',
                'views' => 15420,
                'likes' => 892,
                'comments' => 45,
                'publishedAt' => 'Il y a 2 jours',
                'visibility' => 'public',
                'status' => 'published'
            ],
            [
                'id' => 2,
                'title' => 'Gestion Hôtelière Avancée',
                'description' => 'Techniques avancées de gestion hôtelière pour professionnels.',
                'thumbnail' => '/videos/video2-thumb.jpg',
                'duration' => '18:22',
                'views' => 8750,
                'likes' => 567,
                'comments' => 23,
                'publishedAt' => 'Il y a 5 jours',
                'visibility' => 'public',
                'status' => 'published'
            ]
        ];

        return response()->json($videos);
    }

    /**
     * Récupérer les cours pour l'étudiant connecté
     */
    public function index(Request $request)
    {
        // Données de test pour le développement
        $courses = [
            [
                'id' => 1,
                'title' => 'Introduction au Tourisme Durable',
                'description' => 'Découvrez les fondamentaux du tourisme écologique et les pratiques durables.',
                'thumbnail' => '/videos/video1-thumb.jpg',
                'duration' => '12:34',
                'views' => 15420,
                'likes' => 892,
                'comments' => 45,
                'publishedAt' => 'Il y a 2 jours',
                'visibility' => 'public',
                'status' => 'published'
            ],
            [
                'id' => 2,
                'title' => 'Gestion Hôtelière Avancée - Module 1',
                'description' => 'Première partie de notre formation complète en gestion hôtelière.',
                'thumbnail' => '/videos/video2-thumb.jpg',
                'duration' => '18:22',
                'views' => 8750,
                'likes' => 567,
                'comments' => 23,
                'publishedAt' => 'Il y a 5 jours',
                'visibility' => 'public',
                'status' => 'published',
                'pathway' => 'Certificat Hôtellerie'
            ]
        ];

        return response()->json($courses);
    }

    /**
     * Récupérer les cours pour l'employé connecté
     */
    public function employeeCourses(Request $request): JsonResponse
    {
        $employee = $request->user();
        
        // Récupérer les vidéos créées par le créateur de cet employé
        $videos = Video::where('creator_id', $employee->creator_id)
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'thumbnail' => $video->thumbnail_url,
                    'duration' => $video->duration ?? '00:00',
                    'views' => $video->views ?? 0,
                    'likes' => $video->likes ?? 0,
                    'comments' => $video->comments_count ?? 0,
                    'publishedAt' => $video->created_at->diffForHumans(),
                    'visibility' => $video->visibility,
                    'status' => $video->published_immediately ? 'published' : 'draft',
                    'creator' => [
                        'name' => $video->creator->name ?? 'Formateur',
                        'domain' => $employee->domain
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $videos
        ]);
    }
}
