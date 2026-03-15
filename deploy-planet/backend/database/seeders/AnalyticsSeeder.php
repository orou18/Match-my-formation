<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Analytics;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        // Exemple de données pour peupler la table analytics si nécessaire
        // Sinon, le controller compte déjà les utilisateurs/vidéos existants.
        
        // On peut créer un log d'activité de test
        Analytics::create([
            'event_type' => 'system_init',
            'details' => 'Dashboard admin peuplé par le seeder',
        ]);
    }
}