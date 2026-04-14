<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Employee extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'creator_id',
        'name',
        'email',
        'login_id',
        'password',
        'domain',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * Relation avec le créateur
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Relation avec les pathways assignés
     */
    public function pathways(): BelongsToMany
    {
        return $this->belongsToMany(Pathway::class, 'employee_pathways')
            ->withPivot('assigned_at', 'completed_at', 'progress_percentage', 'is_active')
            ->withTimestamps();
    }

    /**
     * Générer un ID de connexion unique
     */
    public static function generateLoginId(): string
    {
        do {
            $loginId = 'EMP_' . strtoupper(Str::random(8));
        } while (self::where('login_id', $loginId)->exists());

        return $loginId;
    }

    /**
     * Générer un mot de passe aléatoire
     */
    public static function generatePassword(): string
    {
        return Str::random(12) . '123!';
    }
}
