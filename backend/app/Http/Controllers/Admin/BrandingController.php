<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BrandingController extends Controller
{
    private string $storagePath = 'branding/settings.json';

    private function ensureAdmin(): void
    {
        $user = Auth::user();

        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
    }

    private function defaults(): array
    {
        return [
            'id' => '1',
            'company_name' => 'Match My Formation',
            'logo_url' => '/logo.png',
            'primary_color' => '#667eea',
            'secondary_color' => '#764ba2',
            'accent_color' => '#f093fb',
            'background_color' => '#ffffff',
            'surface_color' => '#f8fafc',
            'text_color' => '#1a202c',
            'text_secondary' => '#4a5568',
            'border_color' => '#e2e8f0',
            'font_settings' => [
                'title_font' => 'Inter',
                'subtitle_font' => 'Inter',
                'body_font' => 'Inter',
                'title_font_size' => '2rem',
                'subtitle_font_size' => '1.5rem',
                'body_font_size' => '1rem',
                'title_font_weight' => '700',
                'subtitle_font_weight' => '600',
                'body_font_weight' => '400',
                'title_color' => '#1a202c',
                'subtitle_color' => '#2d3748',
                'body_color' => '#4a5568',
                'title_letter_spacing' => '-0.025em',
                'subtitle_letter_spacing' => '0em',
                'body_letter_spacing' => '0em',
                'title_line_height' => '1.2',
                'subtitle_line_height' => '1.4',
                'body_line_height' => '1.6',
            ],
            'custom_css' => '',
            'favicon_url' => '/favicon.ico',
            'custom_footer_text' => '',
            'show_branding' => true,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString(),
        ];
    }

    private function readSettings(): array
    {
        if (!Storage::disk('local')->exists($this->storagePath)) {
            return $this->defaults();
        }

        $stored = json_decode(Storage::disk('local')->get($this->storagePath), true);

        return is_array($stored) ? array_replace_recursive($this->defaults(), $stored) : $this->defaults();
    }

    private function writeSettings(array $settings): array
    {
        Storage::disk('local')->put($this->storagePath, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return $settings;
    }

    public function show(): JsonResponse
    {
        $this->ensureAdmin();

        return response()->json($this->readSettings());
    }

    public function update(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $settings = $this->readSettings();

        $request->validate([
            'company_name' => 'required|string|max:255',
            'primary_color' => 'required|string|max:20',
            'secondary_color' => 'nullable|string|max:20',
            'accent_color' => 'nullable|string|max:20',
            'background_color' => 'nullable|string|max:20',
            'surface_color' => 'nullable|string|max:20',
            'text_color' => 'nullable|string|max:20',
            'text_secondary' => 'nullable|string|max:20',
            'border_color' => 'nullable|string|max:20',
        ]);

        $fontSettings = $settings['font_settings'];
        $fontKeys = [
            'title_font',
            'subtitle_font',
            'body_font',
            'title_font_size',
            'subtitle_font_size',
            'body_font_size',
            'title_font_weight',
            'subtitle_font_weight',
            'body_font_weight',
            'title_color',
            'subtitle_color',
            'body_color',
            'title_letter_spacing',
            'subtitle_letter_spacing',
            'body_letter_spacing',
            'title_line_height',
            'subtitle_line_height',
            'body_line_height',
        ];

        foreach ($fontKeys as $key) {
            if ($request->filled($key)) {
                $fontSettings[$key] = $request->string($key)->toString();
            }
        }

        if ($request->hasFile('logo_file')) {
            $logoPath = $request->file('logo_file')->store('branding', 'public');
            $settings['logo_url'] = Storage::url($logoPath);
        }

        if ($request->hasFile('favicon_file')) {
            $faviconPath = $request->file('favicon_file')->store('branding', 'public');
            $settings['favicon_url'] = Storage::url($faviconPath);
        }

        $settings = array_merge($settings, [
            'company_name' => $request->string('company_name')->toString(),
            'primary_color' => $request->string('primary_color')->toString(),
            'secondary_color' => $request->string('secondary_color', $settings['secondary_color'])->toString(),
            'accent_color' => $request->string('accent_color', $settings['accent_color'])->toString(),
            'background_color' => $request->string('background_color', $settings['background_color'])->toString(),
            'surface_color' => $request->string('surface_color', $settings['surface_color'])->toString(),
            'text_color' => $request->string('text_color', $settings['text_color'])->toString(),
            'text_secondary' => $request->string('text_secondary', $settings['text_secondary'])->toString(),
            'border_color' => $request->string('border_color', $settings['border_color'])->toString(),
            'custom_css' => $request->string('custom_css', '')->toString(),
            'custom_footer_text' => $request->string('custom_footer_text', '')->toString(),
            'show_branding' => filter_var($request->input('show_branding', true), FILTER_VALIDATE_BOOLEAN),
            'font_settings' => $fontSettings,
            'updated_at' => now()->toISOString(),
        ]);

        return response()->json([
            'message' => 'Paramètres de marque blanche mis à jour avec succès',
            'settings' => $this->writeSettings($settings),
        ]);
    }
}
