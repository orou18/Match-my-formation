<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\CreatorBranding;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CreatorBrandingController extends Controller
{
    public function current(Request $request)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        return response()->json([
            'success' => true,
            'data' => $this->serialize($this->brandingFor($creator), $creator),
        ]);
    }

    public function getBranding(Request $request, $creatorId)
    {
        $user = $request->user();
        abort_unless($user, 401, 'Non authentifié');

        if ($user instanceof Employee) {
            abort_unless((int) $user->creator_id === (int) $creatorId, 403, 'Branding non accessible.');
        } elseif (!in_array($user->role, ['admin', 'creator'], true)) {
            abort(403, 'Accès refusé.');
        } elseif ($user->role === 'creator') {
            abort_unless((int) $user->id === (int) $creatorId, 403, 'Branding non accessible.');
        }

        $creator = User::findOrFail($creatorId);

        return response()->json([
            'success' => true,
            'data' => $this->serialize($this->brandingFor($creator), $creator),
        ]);
    }

    public function updateCurrent(Request $request)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        return $this->updateBranding($request, $creator->id);
    }

    public function updateBranding(Request $request, $creatorId)
    {
        $user = $request->user();
        abort_unless($user && (int) $user->id === (int) $creatorId && $user->role === 'creator', 403, 'Non autorisé');

        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'secondary_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'accent_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'logo' => 'nullable|string|max:2048',
            'logo_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,svg|max:4096',
            'favicon_file' => 'nullable|file|mimes:png,ico,svg|max:1024',
            'custom_css' => 'nullable|string|max:20000',
            'theme' => 'nullable|string|max:50',
            'font_family' => 'nullable|string|max:100',
            'show_branding' => 'nullable',
        ]);

        $branding = $this->brandingFor($user);

        if ($request->hasFile('logo_file')) {
            $validated['logo_url'] = Storage::disk('public')->url(
                $request->file('logo_file')->store('creator-branding/logos', 'public')
            );
        } elseif (!empty($validated['logo'])) {
            $validated['logo_url'] = $validated['logo'];
        }

        if ($request->hasFile('favicon_file')) {
            $validated['favicon_url'] = Storage::disk('public')->url(
                $request->file('favicon_file')->store('creator-branding/favicons', 'public')
            );
        }

        if ($request->has('show_branding')) {
            $validated['show_branding'] = filter_var($request->input('show_branding'), FILTER_VALIDATE_BOOLEAN);
        }

        unset($validated['logo'], $validated['logo_file'], $validated['favicon_file']);

        $branding->fill($validated);
        $branding->save();

        return response()->json([
            'success' => true,
            'message' => 'Branding mis à jour avec succès',
            'data' => $this->serialize($branding, $user),
        ]);
    }

    private function brandingFor(User $creator): CreatorBranding
    {
        return CreatorBranding::firstOrCreate(
            ['creator_id' => $creator->id],
            [
                'company_name' => $creator->name,
                'primary_color' => '#007A7A',
                'secondary_color' => '#004D40',
                'accent_color' => '#FFB800',
                'font_family' => 'Inter',
                'theme' => 'default',
                'show_branding' => true,
            ]
        );
    }

    private function serialize(CreatorBranding $branding, User $creator): array
    {
        return [
            'id' => $branding->id,
            'creator_id' => $creator->id,
            'company_name' => $branding->company_name ?: $creator->name,
            'tagline' => $branding->tagline,
            'primary_color' => $branding->primary_color,
            'secondary_color' => $branding->secondary_color,
            'accent_color' => $branding->accent_color,
            'logo' => $branding->logo_url,
            'logo_url' => $branding->logo_url,
            'favicon_url' => $branding->favicon_url,
            'custom_css' => $branding->custom_css,
            'theme' => $branding->theme,
            'font_family' => $branding->font_family,
            'show_branding' => (bool) $branding->show_branding,
            'font_settings' => [
                'body_font' => $branding->font_family,
                'title_font' => $branding->font_family,
                'subtitle_font' => $branding->font_family,
            ],
        ];
    }
}
