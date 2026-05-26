<?php

namespace Database\Seeders;

use App\Models\Video;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleVideosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtenir un créateur (ou le créer)
        $creator = User::where('role', 'creator')->first();
        if (!$creator) {
            $creator = User::where('role', 'admin')->first();
        }

        if (!$creator) {
            $creator = User::create([
                'name' => 'Expert Formateur',
                'email' => 'creator@match.com',
                'password' => bcrypt('password'),
                'role' => 'creator',
                'avatar' => '/temoignage.png',
            ]);
        }

        $videos = [
            // Tourisme & Hôtellerie
            [
                'title' => 'Introduction à la Gestion Hôtelière',
                'description' => 'Découvrez les principes fondamentaux de la gestion hôtelière, du service client à la gestion des réservations. Une formation essentielle pour tous les professionnels du secteur hôtelier.',
                'category' => 'Hôtellerie',
                'external_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'duration' => 1245,
                'visibility' => 'public',
            ],
            [
                'title' => 'Les Standards de Qualité dans l\'Hôtellerie',
                'description' => 'Apprenez les standards internationaux de qualité en hôtellerie. Nous couvrons les normes de nettoyage, de service et de sécurité qui font la différence entre un établissement ordinaire et un établissement d\'excellence.',
                'category' => 'Hôtellerie',
                'external_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                'thumbnail' => 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
                'duration' => 1890,
                'visibility' => 'public',
            ],
            [
                'title' => 'Gestion des Plaintes et Service Client Exemple',
                'description' => 'Maîtrisez l\'art de gérer les plaintes des clients avec professionnalisme. Cette vidéo vous montre comment transformer une expérience négative en opportunité de fidélisation client.',
                'category' => 'Service Client',
                'external_url' => 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                'thumbnail' => 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
                'duration' => 1567,
                'visibility' => 'public',
            ],
            // Marketing Digital
            [
                'title' => 'Fondamentaux du Marketing Digital',
                'description' => 'Explorez les stratégies de marketing digital modernes. Apprenez comment utiliser les réseaux sociaux, le SEO et le marketing par email pour promouvoir votre entreprise hôtelière.',
                'category' => 'Marketing Digital',
                'external_url' => 'https://www.youtube.com/watch?v=aqz5tCQTshM',
                'thumbnail' => 'https://img.youtube.com/vi/aqz5tCQTshM/maxresdefault.jpg',
                'duration' => 2145,
                'visibility' => 'public',
            ],
            [
                'title' => 'Stratégies de Promotion sur les Réseaux Sociaux',
                'description' => 'Découvrez comment créer une présence efficace sur les réseaux sociaux. De Facebook à Instagram, apprenez à engager votre audience et à booster vos réservations.',
                'category' => 'Marketing Digital',
                'external_url' => 'https://www.youtube.com/watch?v=ZV_r5jL3pKM',
                'thumbnail' => 'https://img.youtube.com/vi/ZV_r5jL3pKM/maxresdefault.jpg',
                'duration' => 1823,
                'visibility' => 'public',
            ],
            // Gestion
            [
                'title' => 'Gestion Budgétaire pour les Petites Structures',
                'description' => 'Un guide pratique pour gérer votre budget comme un professionnel. Apprenez à contrôler vos dépenses, à prévoir vos revenus et à optimiser votre rentabilité.',
                'category' => 'Gestion',
                'external_url' => 'https://www.youtube.com/watch?v=Vhh_GeBPOhs',
                'thumbnail' => 'https://img.youtube.com/vi/Vhh_GeBPOhs/maxresdefault.jpg',
                'duration' => 2234,
                'visibility' => 'public',
            ],
            [
                'title' => 'Leadership et Gestion d\'Équipe',
                'description' => 'Devenez un leader efficace. Cette formation couvre la motivation d\'équipe, la communication, et les stratégies de gestion pour créer un environnement de travail positif.',
                'category' => 'Gestion',
                'external_url' => 'https://www.youtube.com/watch?v=mNrXIspWuKM',
                'thumbnail' => 'https://img.youtube.com/vi/mNrXIspWuKM/maxresdefault.jpg',
                'duration' => 2567,
                'visibility' => 'public',
            ],
            // Tourisme
            [
                'title' => 'Guide Complet de la Destination Touristique',
                'description' => 'Apprenez à connaître votre destination comme un expert. Découvrez les attractions principales, les spécialités locales, et comment offrir une expérience touristique inoubliable.',
                'category' => 'Tourisme',
                'external_url' => 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
                'thumbnail' => 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg',
                'duration' => 1934,
                'visibility' => 'public',
            ],
            [
                'title' => 'Accueil des Touristes Internationaux',
                'description' => 'Les secrets pour accueillir les touristes du monde entier. Apprenez les bases des langues, les protocoles internationaux et comment créer des souvenirs inoubliables.',
                'category' => 'Tourisme',
                'external_url' => 'https://www.youtube.com/watch?v=d-EYlIAqnKM',
                'thumbnail' => 'https://img.youtube.com/vi/d-EYlIAqnKM/maxresdefault.jpg',
                'duration' => 2012,
                'visibility' => 'public',
            ],
            // Restauration
            [
                'title' => 'Hygiène et Sécurité Alimentaire',
                'description' => 'Les normes essentielles d\'hygiène en restauration. Une formation critique pour la santé des clients et la conformité réglementaire de votre établissement.',
                'category' => 'Restauration',
                'external_url' => 'https://www.youtube.com/watch?v=xN1Ku-p4OC4',
                'thumbnail' => 'https://img.youtube.com/vi/xN1Ku-p4OC4/maxresdefault.jpg',
                'duration' => 1756,
                'visibility' => 'public',
            ],
            [
                'title' => 'Service à Table : Techniques et Protocoles',
                'description' => 'Maîtrisez l\'art du service à table. De la présentation des plats au dressage, apprenez tous les détails qui créent une expérience gastronomique exceptionnelle.',
                'category' => 'Restauration',
                'external_url' => 'https://www.youtube.com/watch?v=u_qtFLKM9x8',
                'thumbnail' => 'https://img.youtube.com/vi/u_qtFLKM9x8/maxresdefault.jpg',
                'duration' => 2123,
                'visibility' => 'public',
            ],
            // Développement Durable
            [
                'title' => 'Tourisme Durable et Responsable',
                'description' => 'Comment développer un business touristique respectueux de l\'environnement. Découvrez les pratiques durables qui attirent les clients conscients tout en préservant la planète.',
                'category' => 'Développement Durable',
                'external_url' => 'https://www.youtube.com/watch?v=fyLmzI9RvVU',
                'thumbnail' => 'https://img.youtube.com/vi/fyLmzI9RvVU/maxresdefault.jpg',
                'duration' => 1845,
                'visibility' => 'public',
            ],
            [
                'title' => 'Efficacité Énergétique dans l\'Hôtellerie',
                'description' => 'Réduisez vos coûts énergétiques tout en étant écologique. Apprenez les meilleures pratiques pour optimiser la consommation énergétique de votre établissement.',
                'category' => 'Développement Durable',
                'external_url' => 'https://www.youtube.com/watch?v=AXAGlD-jfmI',
                'thumbnail' => 'https://img.youtube.com/vi/AXAGlD-jfmI/maxresdefault.jpg',
                'duration' => 1678,
                'visibility' => 'public',
            ],
        ];

        // Insérer les vidéos
        foreach ($videos as $video) {
            Video::updateOrCreate(
                ['title' => $video['title']],
                [
                    ...$video,
                    'uploader_id' => $creator->id,
                    'source_type' => 'external',
                    'provider' => 'youtube',
                    'published_at' => now(),
                    'views' => rand(50, 500),
                    'likes' => rand(5, 100),
                ]
            );
        }

        $this->command->info('✅ ' . count($videos) . ' vidéos d\'exemple ont été créées avec succès!');
    }
}
