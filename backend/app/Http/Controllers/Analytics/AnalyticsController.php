<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    /**
     * Récupère les statistiques globales pour le dashboard admin.
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            // On récupère les comptes réels.
            // Si les modèles Video ou Course n'existent pas encore,
            // on met 0 par défaut pour éviter de faire crash le dashboard Next.js

            $totalUsers = User::count() ?? 0;
            $totalVideos = class_exists(Video::class) ? Video::count() : 0;
            $totalCourses = class_exists(Course::class) ? Course::count() : 0;

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalVideos' => $totalVideos,
                'totalCourses' => $totalCourses,
                'recentActivity' => [
                    [
                        'id' => 1,
                        'user' => 'Système',
                        'action' => 'Console d\'administration initialisée',
                        'date' => 'À l\'instant'
                    ],
                    [
                        'id' => 2,
                        'user' => 'Admin Match',
                        'action' => 'Dernière synchronisation réussie',
                        'date' => now()->diffForHumans()
                    ],
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erreur Analytics: " . $e->getMessage());

            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
