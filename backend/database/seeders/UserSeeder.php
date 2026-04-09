<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            return;
        }

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

        $this->command->info("Seed terminé : utilisateurs créés avec le mot de passe {$defaultPassword}");
    }
}
