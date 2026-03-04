<?php

namespace Database\Seeders;

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
        $password = Hash::make('Azerty123!');

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

        $this->command->info('Seed terminé : Utilisateurs créés avec le mot de passe Azerty123!');
    }
}
