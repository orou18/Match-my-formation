<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreatorBrandingController extends Controller
{
    /**
     * Récupérer les informations de branding d'un créateur
     */
    public function getBranding($creatorId)
    {
        try {
            // Vérifier si l'utilisateur est authentifié
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié'
                ], 401);
            }

            // Récupérer le créateur
            $creator = User::find($creatorId);
            if (!$creator) {
                return response()->json([
                    'success' => false,
                    'message' => 'Créateur non trouvé'
                ], 404);
            }

            // Récupérer la company associée si elle existe
            $company = $creator->company;

            // Configuration de branding par défaut
            $branding = [
                'primary_color' => '#007A7A',
                'secondary_color' => '#002D36',
                'accent_color' => '#FFB800',
                'logo' => null,
                'company_name' => $creator->name,
                'custom_css' => null,
                'theme' => 'default',
                'font_family' => 'Inter',
            ];

            // Appliquer les personnalisations de la company si elle existe
            if ($company) {
                $branding['primary_color'] = $company->primary_color ?? $branding['primary_color'];
                $branding['secondary_color'] = $company->secondary_color ?? $branding['secondary_color'];
                $branding['accent_color'] = $company->accent_color ?? $branding['accent_color'];
                $branding['logo'] = $company->logo;
                $branding['company_name'] = $company->name ?? $creator->name;
                $branding['custom_css'] = $company->custom_css;
                $branding['theme'] = $company->theme ?? 'default';
                $branding['font_family'] = $company->font_family ?? 'Inter';
            }

            // Appliquer les personnalisations du créateur
            if ($creator->primary_color) {
                $branding['primary_color'] = $creator->primary_color;
            }
            if ($creator->secondary_color) {
                $branding['secondary_color'] = $creator->secondary_color;
            }
            if ($creator->accent_color) {
                $branding['accent_color'] = $creator->accent_color;
            }
            if ($creator->logo) {
                $branding['logo'] = $creator->logo;
            }
            if ($creator->custom_css) {
                $branding['custom_css'] = $creator->custom_css;
            }

            return response()->json([
                'success' => true,
                'data' => $branding
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du branding: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour les informations de branding d'un créateur
     */
    public function updateBranding(Request $request, $creatorId)
    {
        try {
            // Vérifier si l'utilisateur est authentifié et est le créateur
            $user = Auth::user();
            if (!$user || $user->id != $creatorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé'
                ], 403);
            }

            $validated = $request->validate([
                'primary_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'secondary_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'accent_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'logo' => 'nullable|string',
                'custom_css' => 'nullable|string',
                'theme' => 'nullable|string|in:default,dark,light',
                'font_family' => 'nullable|string',
            ]);

            $creator = User::find($creatorId);
            if (!$creator) {
                return response()->json([
                    'success' => false,
                    'message' => 'Créateur non trouvé'
                ], 404);
            }

            // Mettre à jour les informations de branding
            $creator->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Branding mis à jour avec succès',
                'data' => $validated
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du branding: ' . $e->getMessage()
            ], 500);
        }
    }
}
