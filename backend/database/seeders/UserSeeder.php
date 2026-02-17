<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Création de l'Admin
        User::create([
            'name' => 'Admin Match',
            'email' => 'admin@match.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Création d'un Formateur
        User::create([
            'name' => 'Jean Formateur',
            'email' => 'creator@match.com',
            'password' => Hash::make('password123'),
            'role' => 'creator',
        ]);

        // Création d'un Étudiant
        User::create([
            'name' => 'Alice Eleve',
            'email' => 'student@match.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);
    }
}