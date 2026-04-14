<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use App\Support\TotpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    private function defaultPreferences(): array
    {
        return [
            'theme' => 'light',
            'language' => 'fr',
            'timezone' => 'Africa/Porto-Novo',
            'compactMode' => false,
            'emailUpdates' => true,
        ];
    }

    private function defaultNotificationSettings(): array
    {
        return [
            'courseAlerts' => true,
            'marketingEmails' => false,
            'directMessages' => true,
            'systemAnnouncements' => true,
            'achievementAlerts' => true,
            'weeklyDigest' => true,
        ];
    }

    private function formatProfile(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'phone' => $user->phone,
            'bio' => $user->bio,
            'location' => $user->location,
            'website' => $user->website,
            'created_at' => optional($user->created_at)->toISOString(),
            'updated_at' => optional($user->updated_at)->toISOString(),
        ];
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($this->formatProfile($request));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'bio' => 'nullable|string|max:2000',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'avatar' => 'nullable|string|max:255',
        ]);

        $user->fill($validated);
        $user->save();

        return response()->json($this->formatProfile($request));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
        ]);

        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json([
                'error' => 'Mot de passe actuel incorrect',
            ], 400);
        }

        $user->password = Hash::make($validated['newPassword']);
        $user->last_password_change_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe mis à jour avec succès',
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|max:5120',
        ]);

        $user = $request->user();
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = Storage::url($path);
        $user->save();

        return response()->json([
            'message' => 'Avatar téléchargé avec succès',
            'avatarUrl' => $user->avatar,
            'avatar' => $user->avatar,
        ]);
    }

    public function preferences(Request $request): JsonResponse
    {
        $user = $request->user();
        $preferences = array_merge($this->defaultPreferences(), $user->preferences ?? []);

        return response()->json([
            'success' => true,
            'preferences' => $preferences,
        ]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $user = $request->user();
        $payload = $request->input('preferences', $request->all());
        $preferences = array_merge($this->defaultPreferences(), (array) $payload);

        $user->preferences = $preferences;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Préférences sauvegardées avec succès',
            'preferences' => $preferences,
        ]);
    }

    public function security(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'email' => $user->email,
            'phone' => $user->phone,
            'twoFactorEnabled' => (bool) $user->two_factor_enabled,
            'twoFactorMethod' => $user->two_factor_method,
            'lastPasswordChange' => optional($user->last_password_change_at)->toISOString(),
        ]);
    }

    public function notificationSettings(Request $request): JsonResponse
    {
        $user = $request->user();
        $settings = array_merge($this->defaultNotificationSettings(), $user->notification_settings ?? []);

        return response()->json($settings);
    }

    public function updateNotificationSettings(Request $request): JsonResponse
    {
        $user = $request->user();
        $settings = array_merge($this->defaultNotificationSettings(), $request->all());

        $user->notification_settings = $settings;
        $user->save();

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès',
            ...$settings,
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->notifications()->count() === 0) {
            UserNotification::create([
                'user_id' => $user->id,
                'type' => 'info',
                'title' => 'Bienvenue',
                'message' => 'Votre espace personnel est prêt.',
                'data' => ['source' => 'system'],
            ]);
        }

        return response()->json(
            $user->notifications()
                ->latest()
                ->get()
                ->map(fn (UserNotification $notification) => [
                    'id' => (string) $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'isRead' => (bool) $notification->is_read,
                    'createdAt' => optional($notification->created_at)->toISOString(),
                    'data' => $notification->data,
                ])
        );
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $user = $request->user();
        $action = $request->input('action');
        $notificationId = $request->input('id');

        if ($action === 'mark_all_read') {
            $user->notifications()->update(['is_read' => true]);
            return $this->notifications($request);
        }

        if (!$notificationId) {
            return response()->json(['error' => 'ID notification requis'], 400);
        }

        $notification = $user->notifications()->whereKey($notificationId)->first();
        if (!$notification) {
            return response()->json(['error' => 'Notification introuvable'], 404);
        }

        $notification->is_read = (bool) $request->input('isRead', true);
        $notification->save();

        return $this->notifications($request);
    }

    public function deleteNotifications(Request $request): JsonResponse
    {
        $user = $request->user();
        $notificationId = $request->query('id');

        if ($notificationId) {
            $user->notifications()->whereKey($notificationId)->delete();
        } else {
            $user->notifications()->delete();
        }

        return response()->json(['success' => true]);
    }

    public function unreadNotificationsCount(Request $request): JsonResponse
    {
        return response()->json([
            'count' => $request->user()->notifications()->where('is_read', false)->count(),
        ]);
    }

    public function setupTwoFactor(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'method' => 'required|string|in:app',
        ]);

        $secret = TotpService::generateSecret();
        $user->two_factor_temp_secret = encrypt($secret);
        $user->two_factor_method = $validated['method'];
        $user->save();

        return response()->json([
            'message' => '2FA prêt à être activé',
            'success' => true,
            'method' => 'app',
            'secret' => $secret,
            'otpauthUrl' => TotpService::getOtpAuthUrl(config('app.name', 'MatchMyFormation'), $user->email, $secret),
        ]);
    }

    public function verifyTwoFactor(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'code' => 'required|string|size:6',
            'method' => 'required|string|in:app',
        ]);

        if (!$user->two_factor_temp_secret) {
            return response()->json(['error' => 'Aucune configuration 2FA en attente'], 400);
        }

        $secret = decrypt($user->two_factor_temp_secret);
        if (!TotpService::verifyCode($secret, $validated['code'])) {
            return response()->json(['error' => 'Code de vérification invalide'], 400);
        }

        $user->two_factor_secret = $user->two_factor_temp_secret;
        $user->two_factor_temp_secret = null;
        $user->two_factor_enabled = true;
        $user->two_factor_method = 'app';
        $user->save();

        return response()->json([
            'message' => '2FA activé avec succès',
            'twoFactorEnabled' => true,
            'twoFactorMethod' => 'app',
        ]);
    }

    public function disableTwoFactor(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->two_factor_enabled = false;
        $user->two_factor_method = null;
        $user->two_factor_secret = null;
        $user->two_factor_temp_secret = null;
        $user->save();

        return response()->json([
            'message' => '2FA désactivé avec succès',
            'twoFactorEnabled' => false,
        ]);
    }
}
