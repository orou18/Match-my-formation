<?php

namespace Database\Seeders;

use App\Models\CreatorBranding;
use App\Models\Employee;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultPassword = env('SEED_DEFAULT_PASSWORD', 'Azerty123!');
        $password = Hash::make($defaultPassword);

        $users = [
            [
                'name'     => 'Direction Match Admin',
                'email'    => 'admin@match.com',
                'password' => $password,
                'role'     => 'admin',
            ],
            [
                'name'     => 'Jean Formateur',
                'email'    => 'creator@match.com',
                'password' => $password,
                'role'     => 'creator',
            ],
            [
                'name'     => 'Alice Élève',
                'email'    => 'student@match.com',
                'password' => $password,
                'role'     => 'student',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }

        $creator = User::where('email', 'creator@match.com')->first();
        if ($creator) {
            CreatorBranding::updateOrCreate(
                ['creator_id' => $creator->id],
                [
                    'company_name' => 'Jean Formateur',
                    'tagline' => 'Expert en tourisme',
                    'primary_color' => '#007A7A',
                    'secondary_color' => '#004D40',
                    'accent_color' => '#FFB800',
                    'font_family' => 'Inter',
                    'show_branding' => true,
                ]
            );

            Employee::updateOrCreate(
                ['email' => 'employee@match.com'],
                [
                    'creator_id' => $creator->id,
                    'name' => 'Emma Employée',
                    'login_id' => 'EMP_DEMO_001',
                    'password' => Hash::make($defaultPassword),
                    'domain' => 'Formation',
                    'is_active' => true,
                ]
            );
        }

        PlatformSetting::updateOrCreate(
            ['key' => 'admin_branding'],
            ['value' => [
                'company_name' => 'Match My Formation',
                'primary_color' => '#007A7A',
                'secondary_color' => '#004D40',
                'accent_color' => '#FFB800',
                'show_branding' => true,
            ]]
        );

        $this->command->info("Seed terminé : utilisateurs créés avec le mot de passe {$defaultPassword}");
    }
}
