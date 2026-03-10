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
            ],
            [
                'id' => 3,
                'title' => 'Marketing Digital pour le Tourisme',
                'description' => 'Stratégies digitales et marketing pour les professionnels du secteur touristique.',
                'thumbnail' => '/videos/video3-thumb.jpg',
                'duration' => '15:45',
                'views' => 6230,
                'likes' => 445,
                'comments' => 18,
                'publishedAt' => 'Il y a 1 semaine',
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
}
