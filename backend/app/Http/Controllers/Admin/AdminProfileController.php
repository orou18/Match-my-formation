<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminProfileController extends Controller
{
    // Affiche le profil de l'admin connecté
    public function show()
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }

            $profile = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar ?? '/temoignage.png',
                'bio' => $user->bio ?? '',
                'phone' => $user->phone ?? '',
                'location' => $user->location ?? '',
                'website' => $user->website ?? '',
                'department' => 'Administration',
                'join_date' => $user->created_at->format('Y-m-d'),
                'last_login' => $user->last_login_at ? $user->last_login_at->format('Y-m-d H:i:s') : null,
                'status' => 'active',
                'two_factor_enabled' => (bool) $user->two_factor_enabled,
                'email_notifications' => true,
                'language' => 'fr',
                'timezone' => 'Africa/Porto-Novo',
                'permissions' => $this->getAdminPermissions($user->role),
            ];

            return response()->json([
                'profile' => $profile,
                'session' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'role' => $user->role,
                    'permissions' => $profile['permissions'],
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Met à jour le profil de l'admin connecté
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'bio' => 'sometimes|nullable|string|max:1000',
                'phone' => 'sometimes|nullable|string|max:20',
                'location' => 'sometimes|nullable|string|max:255',
                'website' => 'sometimes|nullable|url|max:255',
                'avatar' => 'sometimes|nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation échouée',
                    'details' => $validator->errors()
                ], 422);
            }

            $user->update($validator->validated());

            // Retourner le profil mis à jour
            return $this->show();

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Change le mot de passe de l'admin connecté
    public function changePassword(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }

            $validator = Validator::make($request->all(), [
                'currentPassword' => 'required|string',
                'newPassword' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation échouée',
                    'details' => $validator->errors()
                ], 422);
            }

            // Vérifier le mot de passe actuel
            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json([
                    'error' => 'Mot de passe actuel incorrect'
                ], 400);
            }

            // Mettre à jour le mot de passe
            $user->update([
                'password' => Hash::make($request->newPassword),
                'last_password_change_at' => now(),
            ]);

            return response()->json([
                'message' => 'Mot de passe modifié avec succès',
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Upload l'avatar de l'admin connecté
    public function uploadAvatar(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }

            $validator = Validator::make($request->all(), [
                'avatar' => 'required|image|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation échouée',
                    'details' => $validator->errors()
                ], 422);
            }

            if (!$request->hasFile('avatar')) {
                return response()->json([
                    'error' => 'Aucun fichier fourni'
                ], 400);
            }

            $file = $request->file('avatar');
            
            // Vérifier le type de fichier
            if (!$file->isValid() || !str_starts_with($file->getMimeType(), 'image/')) {
                return response()->json([
                    'error' => 'Le fichier doit être une image'
                ], 400);
            }

            // Générer un nom de fichier unique
            $filename = 'admin_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Stocker dans storage/app/public/avatars
            $path = $file->storeAs('avatars', $filename, 'public');

            if (!$path) {
                return response()->json([
                    'error' => 'Erreur lors du téléchargement'
                ], 500);
            }

            // Mettre à jour l'URL de l'avatar dans la base de données
            $avatarUrl = '/storage/' . $path;
            $user->update(['avatar' => $avatarUrl]);

            return response()->json([
                'message' => 'Avatar téléchargé avec succès',
                'avatar' => $avatarUrl,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Obtient les permissions par défaut pour un rôle admin
    private function getAdminPermissions(string $role): array
    {
        $defaultPermissions = [
            'analytics_view',
            'users_view',
            'creators_manage',
            'content_view',
            'content_manage',
            'ads_manage',
            'webinars_manage',
            'settings_system',
        ];

        $superAdminPermissions = array_merge($defaultPermissions, [
            'users_create',
            'users_edit',
            'users_delete',
            'creators_view',
        ]);

        return $role === 'super_admin' ? $superAdminPermissions : $defaultPermissions;
    }
}