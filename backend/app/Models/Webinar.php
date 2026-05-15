<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Webinar extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'speaker_id',
        'date',
        'time',
        'duration',
        'status',
        'max_participants',
        'category',
        'thumbnail',
        'recording_url',
        'meeting_url',
        'meeting_id',
        'password',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'duration' => 'integer',
        'max_participants' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Statuts possibles
     */
    const STATUSES = ['upcoming', 'live', 'completed', 'cancelled'];

    /**
     * Relation avec le speaker
     */
    public function speaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'speaker_id');
    }

    /**
     * Relation avec les inscriptions
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(WebinarRegistration::class);
    }

    /**
     * Relation avec les stats
     */
    public function stats(): HasMany
    {
        return $this->hasMany(WebinarStats::class);
    }

    /**
     * Obtenir le nombre d'inscrits
     */
    public function getRegisteredUsersAttribute(): int
    {
        return $this->registrations()->count();
    }

    /**
     * Obtenir le nombre de places disponibles
     */
    public function getAvailablePlacesAttribute(): int
    {
        return max(0, $this->max_participants - $this->registered_users);
    }

    /**
     * Obtenir le taux de remplissage
     */
    public function getFillRateAttribute(): float
    {
        return $this->max_participants > 0 
            ? round(($this->registered_users / $this->max_participants) * 100, 2)
            : 0;
    }

    /**
     * Vérifier si le webinaire est complet
     */
    public function isFull(): bool
    {
        return $this->registered_users >= $this->max_participants;
    }

    /**
     * Démarrer le webinaire (passer en status live)
     */
    public function start(): bool
    {
        if ($this->status !== 'upcoming') {
            return false;
        }

        return $this->update(['status' => 'live']);
    }

    /**
     * Terminer le webinaire
     */
    public function complete(): bool
    {
        if ($this->status !== 'live') {
            return false;
        }

        return $this->update(['status' => 'completed']);
    }

    /**
     * Annuler le webinaire
     */
    public function cancel(): bool
    {
        if (in_array($this->status, ['completed', 'cancelled'])) {
            return false;
        }

        return $this->update(['status' => 'cancelled']);
    }

    /**
     * Inscrire un utilisateur
     */
    public function registerUser(int $userId): bool
    {
        if ($this->isFull()) {
            return false;
        }

        // Vérifier si l'utilisateur n'est pas déjà inscrit
        if ($this->registrations()->where('user_id', $userId)->exists()) {
            return false;
        }

        return $this->registrations()->create([
            'user_id' => $userId,
            'registered_at' => now(),
        ]) ? true : false;
    }

    /**
     * Calculer les statistiques du webinaire
     */
    public function calculateStats(): array
    {
        $stats = $this->stats()->first();

        return [
            'views' => $stats->views ?? 0,
            'engagement' => $stats->engagement ?? 0,
            'satisfaction' => $stats->satisfaction ?? 0,
            'attendance_rate' => $this->registered_users > 0 
                ? round(($stats->attendees ?? 0) / $this->registered_users * 100, 2)
                : 0,
        ];
    }
}
