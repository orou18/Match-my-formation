<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Company;
use App\Models\Course;
use App\Models\Module;
use App\Models\Video;
use App\Models\Enrollment;
use App\Models\Pathway;
use App\Models\ChatMessage;

class EnhancedDatabaseSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Vider les tables
        $this->truncateTables();
        
        // Créer les données enrichies
        $this->createUsers();
        $this->createCompanies();
        $this->createCourses();
        $this->createModules();
        $this->createVideos();
        $this->createEnrollments();
        $this->createPathways();
        $this->createChatMessages();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Base de données enrichie créée avec succès !');
    }
    
    private function truncateTables()
    {
        $tables = [
            'chat_messages', 'enrollments', 'videos', 'modules', 
            'pathways', 'courses', 'creator_profiles', 'companies', 'users'
        ];
        
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
    }
    
    private function createUsers()
    {
        // Admins
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@matchmyformation.com',
            'password' => Hash::make('Azerty123!'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        User::create([
            'name' => 'Marie Laurent',
            'email' => 'marie.laurent@matchmyformation.com',
            'password' => Hash::make('Azerty123!'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Créateurs de contenu (20 créateurs)
        $creators = [
            ['Jean Dupont', 'chef@matchmyformation.com', 'Chef étoilé', '15 ans d\'expérience'],
            ['Sophie Martin', 'sommelier@matchmyformation.com', 'Sommelier', 'MS en sommellerie'],
            ['Pierre Bernard', 'restaurant@matchmyformation.com', 'Restaurateur', '3 restaurants'],
            ['Marie Dubois', 'hotel@matchmyformation.com', 'Directrice d\'hôtel', 'Hôtel 5 étoiles'],
            ['Thomas Petit', 'barman@matchmyformation.com', 'Barman', 'Champion de France'],
            ['Claire Robert', 'event@matchmyformation.com', 'Event manager', '100+ événements'],
            ['Nicolas Durand', 'catering@matchmyformation.com', 'Caterer', 'Traiteur premium'],
            ['Isabelle Leroy', 'tourisme@matchmyformation.com', 'Guide touristique', '20 ans d\'expérience'],
            ['François Moreau', 'vin@matchmyformation.com', 'Œnologue', 'Expert en vin'],
            ['Camille Simon', 'marketing@matchmyformation.com', 'Marketing hôtelier', 'Hôtellerie luxe'],
            ['Antoine Garnier', 'reception@matchmyformation.com', 'Réceptionniste', 'Hôtel 4 étoiles'],
            ['Julie Chevalier', 'spa@matchmyformation.com', 'Spa manager', 'Wellness expert'],
            ['David Rousseau', 'cuisine@matchmyformation.com', 'Cuisinier', 'Spécialiste cuisine française'],
            ['Eva Lambert', 'digital@matchmyformation.com', 'Digital nomad', 'Tourisme digital'],
            ['Marc Girard', 'safety@matchmyformation.com', 'Safety officer', 'Sécurité hôtelière'],
            ['Laura Bonnet', 'hr@matchmyformation.com', 'RH hôtellerie', 'Recruteur expert'],
            ['Kevin Faure', 'tech@matchmyformation.com', 'Tech hotelier', 'Innovation hôtelière'],
            ['Sarah Meyer', 'design@matchmyformation.com', 'Designer d\'intérieur', 'Hôtellerie design'],
            ['Olivier Blanc', 'finance@matchmyformation.com', 'Finance hôtelier', 'Expert financier'],
            ['Emma Roux', 'quality@matchmyformation.com', 'Quality manager', 'Qualité service'],
        ];
        
        foreach ($creators as $creator) {
            User::create([
                'name' => $creator[0],
                'email' => $creator[1],
                'password' => Hash::make('Azerty123!'),
                'role' => 'creator',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Étudiants (100 étudiants)
        for ($i = 1; $i <= 100; $i++) {
            $firstNames = ['Alex', 'Marie', 'Thomas', 'Julie', 'Lucas', 'Léa', 'Nathan', 'Chloé', 'Hugo', 'Emma'];
            $lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
            
            User::create([
                'name' => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)] . $i,
                'email' => 'student' . $i . '@matchmyformation.com',
                'password' => Hash::make('Azerty123!'),
                'role' => 'student',
                'email_verified_at' => now(),
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
        }
    }
    
    private function createCompanies()
    {
        $companies = [
            ['Hôtel Plaza Athénée', 'Paris', '5 étoiles', 'Hôtel de luxe parisien'],
            ['Restaurant Guy Savoy', 'Paris', '3 étoiles Michelin', 'Haute cuisine française'],
            ['Four Seasons George V', 'Paris', 'Palace', 'Hôtel de prestige'],
            ['Le Meurice', 'Paris', 'Palace', 'Hôtel historique'],
            ['The Ritz', 'Paris', 'Palace', 'Hôtel légendaire'],
            ['Crillon', 'Paris', 'Palace', 'Hôtel de luxe'],
            ['Le Bristol', 'Paris', 'Palace', 'Hôtel 5 étoiles'],
            ['Mandarin Oriental', 'Paris', '5 étoiles', 'Hôtel asiatique'],
            ['Shangri-La', 'Paris', '5 étoiles', 'Hôtel asiatique'],
            ['Peninsula Paris', 'Paris', '5 étoiles', 'Hôtel hongkongais'],
        ];
        
        foreach ($companies as $company) {
            Company::create([
                'name' => $company[0],
                'address' => $company[1],
                'industry' => $company[2],
                'description' => $company[3],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
    private function createCourses()
    {
        $courses = [
            // Cuisine
            [
                'title' => 'Techniques de Cuisine Française',
                'description' => 'Apprenez les techniques fondamentales de la cuisine française avec un chef étoilé',
                'category' => 'cuisine',
                'level' => 'beginner',
                'price' => 299.99,
                'duration' => 40,
                'creator_id' => 6,
                'image' => 'cuisine-francaise.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Pâtisserie Professionnelle',
                'description' => 'Maîtrisez l\'art de la pâtisserie française',
                'category' => 'cuisine',
                'level' => 'intermediate',
                'price' => 399.99,
                'duration' => 60,
                'creator_id' => 6,
                'image' => 'patisserie.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Cuisine Moléculaire',
                'description' => 'Explorez les techniques innovantes de la cuisine moléculaire',
                'category' => 'cuisine',
                'level' => 'advanced',
                'price' => 599.99,
                'duration' => 80,
                'creator_id' => 6,
                'image' => 'cuisine-moleculaire.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Œnologie
            [
                'title' => 'Initiation à la Dégustation de Vin',
                'description' => 'Apprenez à déguster et évaluer les vins comme un professionnel',
                'category' => 'oenologie',
                'level' => 'beginner',
                'price' => 199.99,
                'duration' => 30,
                'creator_id' => 14,
                'image' => 'degustation-vin.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Vins de Bordeaux - Maîtrise',
                'description' => 'Explorez en profondeur les vins de la région de Bordeaux',
                'category' => 'oenologie',
                'level' => 'intermediate',
                'price' => 349.99,
                'duration' => 50,
                'creator_id' => 14,
                'image' => 'vins-bordeaux.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            [
                'title' => 'Vins du Monde',
                'description' => 'Tour d\'horizon des vignobles du monde entier',
                'category' => 'oenologie',
                'level' => 'advanced',
                'price' => 499.99,
                'duration' => 70,
                'creator_id' => 14,
                'image' => 'vins-monde.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Service
            [
                'title' => 'Art du Service Restaurant',
                'description' => 'Maîtrisez les techniques de service haut de gamme',
                'category' => 'service',
                'level' => 'beginner',
                'price' => 249.99,
                'duration' => 35,
                'creator_id' => 11,
                'image' => 'service-restaurant.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Management de Restaurant',
                'description' => 'Gérez efficacement un établissement restaurant',
                'category' => 'service',
                'level' => 'intermediate',
                'price' => 449.99,
                'duration' => 55,
                'creator_id' => 11,
                'image' => 'management-restaurant.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Hôtellerie
            [
                'title' => 'Gestion Hôtelière Fondamentale',
                'description' => 'Les bases de la gestion d\'un hôtel',
                'category' => 'hotellerie',
                'level' => 'beginner',
                'price' => 349.99,
                'duration' => 45,
                'creator_id' => 4,
                'image' => 'gestion-hoteliere.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Revenue Management Hôtelier',
                'description' => 'Optimisez vos revenus hôteliers',
                'category' => 'hotellerie',
                'level' => 'advanced',
                'price' => 599.99,
                'duration' => 65,
                'creator_id' => 4,
                'image' => 'revenue-management.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Tourisme
            [
                'title' => 'Guide Touristique Certifié',
                'description' => 'Devenez guide touristique professionnel',
                'category' => 'tourisme',
                'level' => 'beginner',
                'price' => 299.99,
                'duration' => 40,
                'creator_id' => 8,
                'image' => 'guide-touristique.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Tourisme Durable',
                'description' => 'Le tourisme respectueux de l\'environnement',
                'category' => 'tourisme',
                'level' => 'intermediate',
                'price' => 399.99,
                'duration' => 50,
                'creator_id' => 8,
                'image' => 'tourisme-durable.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Marketing
            [
                'title' => 'Marketing Hôtelier Digital',
                'description' => 'Stratégies marketing pour l\'hôtellerie',
                'category' => 'marketing',
                'level' => 'intermediate',
                'price' => 449.99,
                'duration' => 55,
                'creator_id' => 10,
                'image' => 'marketing-digital.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Réseaux Sociaux pour l\'Hôtellerie',
                'description' => 'Utilisez les réseaux sociaux pour promouvoir votre établissement',
                'category' => 'marketing',
                'level' => 'beginner',
                'price' => 249.99,
                'duration' => 30,
                'creator_id' => 10,
                'image' => 'reseaux-sociaux.jpg',
                'status' => 'published',
                'featured' => false,
            ],
            
            // Événementiel
            [
                'title' => 'Organisation d\'Événements',
                'description' => 'Planifiez et organisez des événements réussis',
                'category' => 'evenementiel',
                'level' => 'beginner',
                'price' => 349.99,
                'duration' => 45,
                'creator_id' => 6,
                'image' => 'organisation-evenements.jpg',
                'status' => 'published',
                'featured' => true,
            ],
            [
                'title' => 'Gestion de Projets Événementiels',
                'description' => 'Managez des projets événementiels complexes',
                'category' => 'evenementiel',
                'level' => 'advanced',
                'price' => 549.99,
                'duration' => 70,
                'creator_id' => 6,
                'image' => 'gestion-projets.jpg',
                'status' => 'published',
                'featured' => false,
            ],
        ];
        
        foreach ($courses as $course) {
            Course::create([
                'title' => $course['title'],
                'description' => $course['description'],
                'category' => $course['category'],
                'level' => $course['level'],
                'price' => $course['price'],
                'duration' => $course['duration'],
                'creator_id' => $course['creator_id'],
                'image' => $course['image'],
                'status' => $course['status'],
                'featured' => $course['featured'],
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now(),
            ]);
        }
    }
    
    private function createModules()
    {
        $courses = Course::all();
        
        foreach ($courses as $course) {
            $moduleCount = rand(5, 10);
            
            for ($i = 1; $i <= $moduleCount; $i++) {
                Module::create([
                    'title' => "Module {$i}: " . $this->getModuleTitle($course->category, $i),
                    'description' => "Description détaillée du module {$i} du cours {$course->title}",
                    'course_id' => $course->id,
                    'order' => $i,
                    'duration' => rand(20, 60),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
    
    private function getModuleTitle($category, $order)
    {
        $titles = [
            'cuisine' => ['Introduction et Sécurité', 'Techniques de Coupe', 'Cuissons de Base', 'Suces Fondamentales', 'Plats Principaux', 'Desserts Classiques', 'Présentation', 'Hygiène', 'Créativité', 'Spécialités Régionales'],
            'oenologie' => ['Histoire du Vin', 'Types de Cépages', 'Régions Viticoles', 'Dégustation', 'Accords Mets-Vins', 'Service du Vin', 'Conservation', 'Achat de Vin', 'Vins du Monde', 'Analyse Sensorielle'],
            'service' => ['Accueil Client', 'Techniques de Service', 'Gestion des Tables', 'Communication', 'Gestion des Plaintes', 'Upselling', 'Service Bar', 'Service Événementiel', 'Management d\'Équipe', 'Qualité Service'],
            'hotellerie' => ['Introduction Hôtellerie', 'Types d\'Hôtels', 'Réception', 'Gestion des Chambres', 'Maintenance', 'Sécurité', 'Marketing Hôtelier', 'Revenue Management', 'Gestion Équipe', 'Stratégie'],
            'tourisme' => ['Introduction Tourisme', 'Types de Tourisme', 'Planification', 'Guidage', 'Communication', 'Sécurité', 'Culture Locale', 'Marketing Touristique', 'Tourisme Durable', 'Gestion Groupes'],
            'marketing' => ['Introduction Marketing', 'Analyse Marché', 'Stratégie Digitale', 'Réseaux Sociaux', 'Email Marketing', 'SEO/SEM', 'Content Marketing', 'Analytics', 'Budget Marketing', 'ROI'],
            'evenementiel' => ['Planification', 'Budget Événement', 'Vente Lieu', 'Fournisseurs', 'Logistique', 'Sécurité', 'Marketing Événement', 'Gestion Jour J', 'Post-Événement', 'Crise Management'],
        ];
        
        return $titles[$category][$order - 1] ?? "Module {$order}";
    }
    
    private function createVideos()
    {
        $modules = Module::all();
        
        foreach ($modules as $module) {
            $videoCount = rand(3, 8);
            
            for ($i = 1; $i <= $videoCount; $i++) {
                Video::create([
                    'title' => "Vidéo {$i}: " . $this->getVideoTitle($module->title, $i),
                    'description' => "Description de la vidéo {$i} pour {$module->title}",
                    'url' => "https://example.com/video/{$module->id}_{$i}",
                    'duration' => rand(300, 1800), // 5 à 30 minutes
                    'module_id' => $module->id,
                    'order' => $i,
                    'thumbnail' => "thumbnail_{$module->id}_{$i}.jpg",
                    'views' => rand(100, 5000),
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ]);
            }
        }
    }
    
    private function getVideoTitle($moduleTitle, $order)
    {
        return "Leçon {$order} - {$moduleTitle}";
    }
    
    private function createEnrollments()
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::where('status', 'published')->get();
        
        foreach ($students as $student) {
            // Chaque étudiant s'inscrit à 3-7 cours aléatoires
            $enrollmentCount = rand(3, 7);
            $selectedCourses = $courses->random($enrollmentCount);
            
            foreach ($selectedCourses as $course) {
                Enrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'progress' => rand(0, 100),
                    'status' => rand(0, 100) === 100 ? 'completed' : 'active',
                    'enrolled_at' => now()->subDays(rand(1, 90)),
                    'completed_at' => rand(0, 100) === 100 ? now()->subDays(rand(1, 30)) : null,
                ]);
            }
        }
    }
    
    private function createPathways()
    {
        $pathways = [
            [
                'title' => 'Par Chef Étoilé',
                'description' => 'Devenez chef de cuisine haut de gamme',
                'courses' => [1, 2, 3], // IDs des cours de cuisine
                'duration' => 180,
                'price' => 1299.99,
            ],
            [
                'title' => 'Expert en Œnologie',
                'description' => 'Maîtrisez l\'art du vin',
                'courses' => [4, 5, 6],
                'duration' => 150,
                'price' => 999.99,
            ],
            [
                'title' => 'Manager Hôtelier',
                'description' => 'Gérez un établissement hôtelier de prestige',
                'courses' => [9, 10, 7],
                'duration' => 165,
                'price' => 1399.99,
            ],
            [
                'title' => 'Tourisme Durable',
                'description' => 'Spécialiste du tourisme responsable',
                'courses' => [11, 12],
                'duration' => 90,
                'price' => 699.99,
            ],
            [
                'title' => 'Marketing Hôtelier Digital',
                'description' => 'Expert en marketing digital hôtelier',
                'courses' => [13, 14],
                'duration' => 85,
                'price' => 699.99,
            ],
        ];
        
        foreach ($pathways as $pathway) {
            Pathway::create([
                'title' => $pathway['title'],
                'description' => $pathway['description'],
                'duration' => $pathway['duration'],
                'price' => $pathway['price'],
                'courses' => json_encode($pathway['courses']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
    private function createChatMessages()
    {
        $users = User::all();
        
        // Créer des messages de chat entre utilisateurs
        for ($i = 0; $i < 200; $i++) {
            $sender = $users->random();
            $receiver = $users->where('id', '!=', $sender->id)->random();
            
            ChatMessage::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'message' => $this->getRandomMessage(),
                'created_at' => now()->subHours(rand(1, 720)),
                'updated_at' => now(),
            ]);
        }
    }
    
    private function getRandomMessage()
    {
        $messages = [
            'Bonjour ! Comment allez-vous ?',
            'J\'adore ce cours, il est très instructif !',
            'Quelqu\'un a terminé le module 3 ?',
            'Je recommande vivement ce parcours.',
            'Les vidéos sont de très bonne qualité.',
            'Comment accéder aux ressources supplémentaires ?',
            'Félicitations pour votre progression !',
            'Le certificat est-il reconnu ?',
            'Je suis bloqué à la leçon 5, aidez-moi svp.',
            'Excellent contenu, merci !',
            'Quand est la prochaine session en direct ?',
            'Les quiz sont très pertinents.',
            'Je vais recommander cette plateforme.',
            'Support client très réactif.',
            'Les exercices pratiques sont géniaux.',
        ];
        
        return $messages[array_rand($messages)];
    }
}
