<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Notifications simulées pour le démonstration
            $notifications = [
                [
                    'id' => 1,
                    'type' => 'success',
                    'category' => 'content',
                    'title' => 'Vidéo publiée avec succès',
                    'message' => 'Votre vidéo "Introduction au tourisme" a été publiée et est maintenant disponible.',
                    'read' => false,
                    'created_at' => now()->subMinutes(15)->toISOString(),
                    'action_url' => '/creator/videos',
                    'action_text' => 'Voir la vidéo',
                ],
                [
                    'id' => 2,
                    'type' => 'info',
                    'category' => 'performance',
                    'title' => 'Nouveau record de vues',
                    'message' => 'Vos vidéos ont atteint 10 000 vues cette semaine !',
                    'read' => false,
                    'created_at' => now()->subHours(2)->toISOString(),
                    'action_url' => '/creator/stats',
                    'action_text' => 'Voir les statistiques',
                ],
                [
                    'id' => 3,
                    'type' => 'warning',
                    'category' => 'system',
                    'title' => 'Mise à jour système',
                    'message' => 'Une maintenance est prévue demain à 2h du matin.',
                    'read' => true,
                    'created_at' => now()->subHours(6)->toISOString(),
                ],
                [
                    'id' => 4,
                    'type' => 'success',
                    'category' => 'social',
                    'title' => 'Nouvel abonné',
                    'message' => 'Jean Dupont s\'est abonné à votre chaîne.',
                    'read' => true,
                    'created_at' => now()->subDays(1)->toISOString(),
                ],
                [
                    'id' => 5,
                    'type' => 'info',
                    'category' => 'content',
                    'title' => 'Commentaire sur votre vidéo',
                    'message' => 'Marie a commenté : "Excellent contenu, merci !"',
                    'read' => true,
                    'created_at' => now()->subDays(2)->toISOString(),
                    'action_url' => '/creator/videos/1',
                    'action_text' => 'Voir le commentaire',
                ],
            ];

            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Logique pour marquer comme lu (simulation)
            return response()->json(['message' => 'Notification marquée comme lue']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Logique pour marquer tout comme lu (simulation)
            return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Logique pour supprimer (simulation)
            return response()->json(['message' => 'Notification supprimée']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function archive($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Logique pour archiver (simulation)
            return response()->json(['message' => 'Notification archivée']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
