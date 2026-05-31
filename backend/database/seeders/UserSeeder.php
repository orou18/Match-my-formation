<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

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

        // 1. Liste des utilisateurs de base
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
            [
                'name'     => 'Thomas Employé',
                'email'    => 'employee@match.com',
                'password' => $password,
                'role'     => 'student', // Rôle ENUM accepté
            ],
        ];

        $creatorUser = null;

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            if ($user->email === 'creator@match.com') {
                $creatorUser = $user;
            }

            // 2. Si c'est l'employé, on s'adapte dynamiquement à tes colonnes
            if ($user->email === 'employee@match.com') {

                // On récupère la première entreprise au cas où ta table demande une liaison entreprise
                $company = \App\Models\Company::first();

                // On prépare les données à insérer selon ce qui existe dans ta table
                $employeeData = [];

                if (Schema::hasColumn('employees', 'company_id') && $company) {
                    $employeeData['company_id'] = $company->id;
                }

                if (Schema::hasColumn('employees', 'creator_id')) {
                    if (!$creatorUser) {
                        $creatorUser = User::where('email', 'creator@match.com')->first();
                    }
                    $employeeData['creator_id'] = $creatorUser ? $creatorUser->id : null;
                }

                // Si la colonne 'user_id' n'existe pas, on cherche une autre colonne de liaison
                // ou on crée simplement l'employé avec les attributs requis (ex: name, email)
                if (Schema::hasColumn('employees', 'user_id')) {
                    Employee::updateOrCreate(['user_id' => $user->id], $employeeData);
                } else {
                    // Si pas de user_id, on lie probablement par l'email ou un autre champ dans 'employees'
                    $searchKey = Schema::hasColumn('employees', 'email') ? ['email' => $user->email] : ['id' => 1];

                    // On ajoute les champs de base au cas où ils sont requis directement dans la table employees
                    if (Schema::hasColumn('employees', 'name')) $employeeData['name'] = $user->name;
                    if (Schema::hasColumn('employees', 'email')) $employeeData['email'] = $user->email;

                    Employee::updateOrCreate($searchKey, $employeeData);
                }
            }
        }

        $this->command->info("Seed terminé avec succès ! Thomas a été configuré et rattaché selon la structure de ta table employees.");
    }
}
