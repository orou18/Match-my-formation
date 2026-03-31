<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs qui peuvent être assignés en masse.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'company_id', // AJOUT : Pour lier un partenaire à son entreprise
        'avatar',
        'phone',
        'bio',
        'location',
        'website',
        'preferences',
        'notification_settings',
        'two_factor_enabled',
        'two_factor_method',
        'two_factor_secret',
        'two_factor_temp_secret',
        'two_factor_code_hash',
        'two_factor_code_expires_at',
        'last_password_change_at',
    ];

    /**
     * Valeurs par défaut pour les attributs.
     */
    protected $attributes = [
        'role' => 'student',
    ];

    /**
     * Les attributs qui doivent être cachés pour la sérialisation (JSON).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les attributs qui doivent être castés (typés).
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'preferences' => 'array',
        'notification_settings' => 'array',
        'two_factor_enabled' => 'boolean',
        'two_factor_code_expires_at' => 'datetime',
        'last_password_change_at' => 'datetime',
    ];

    // =========================================================================
    // RELATIONS
    // =========================================================================

    /**
     * L'entreprise à laquelle appartient l'utilisateur (si c'est un partenaire).
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Les vidéos uploadées par cet utilisateur.
     */
    public function videos(): HasMany
    {
        return $this->hasMany(Video::class, 'uploader_id');
    }

    public function createdPathways(): HasMany
    {
        return $this->hasMany(Pathway::class, 'creator_id');
    }

    /**
     * Les inscriptions aux cours (si c'est un étudiant).
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function likedVideos(): BelongsToMany
    {
        return $this->belongsToMany(Video::class, 'video_likes')->withTimestamps();
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(UserNotification::class);
    }

    // =========================================================================
    // HELPERS (Utile pour ton Frontend)
    // =========================================================================

    /**
     * Vérifie si l'utilisateur est un administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est un partenaire/créateur.
     */
    public function isPartner(): bool
    {
        return in_array($this->role, ['partner', 'creator']);
    }
}
