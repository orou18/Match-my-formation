<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
// use App\Models\Video; // Décommente si tu as ces modèles
// use App\Models\Course;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'total_users' => User::where('role', 'student')->count(),
            'total_videos' => 24, // Remplace par Video::count() plus tard
            'total_courses' => 12, // Remplace par Course::count() plus tard
            'recent_activity' => [
                [
                    'id' => 1,
                    'user' => 'Nouvel inscrit',
                    'action' => 'Alice vient de rejoindre la plateforme',
                    'date' => 'Aujourd\'hui'
                ],
                [
                    'id' => 2,
                    'user' => 'Contenu',
                    'action' => 'Nouvelle vidéo ajoutée en Marketing',
                    'date' => 'Hier'
                ]
            ]
        ]);
    }
}
