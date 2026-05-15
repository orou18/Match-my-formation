<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'target',
        'status',
        'scheduled_at',
        'sent_at',
        'recipients_count',
        'opened_count',
        'clicked_count',
        'created_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'recipients_count' => 'integer',
        'opened_count' => 'integer',
        'clicked_count' => 'integer',
    ];

    /**
     * Types de notifications
     */
    const TYPES = ['info', 'success', 'warning', 'error'];

    /**
     * Cibles de notifications
     */
    const TARGETS = ['all', 'users', 'creators', 'admins'];

    /**
     * Statuts de notifications
     */
    const STATUSES = ['draft', 'scheduled', 'sent'];

    /**
     * Relation avec l'utilisateur qui a créé la notification
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Calculer le taux d'ouverture
     */
    public function getOpenRateAttribute(): float
    {
        return $this->recipients_count > 0 
            ? round(($this->opened_count / $this->recipients_count) * 100, 2)
            : 0;
    }

    /**
     * Calculer le taux de clic
     */
    public function getClickRateAttribute(): float
    {
        return $this->opened_count > 0 
            ? round(($this->clicked_count / $this->opened_count) * 100, 2)
            : 0;
    }

    /**
     * Envoyer la notification aux destinataires
     */
    public function send(): bool
    {
        try {
            // Récupérer les destinataires selon la cible
            $recipients = $this->getRecipients();
            
            // Envoyer à chaque destinataire
            foreach ($recipients as $user) {
                // Créer une notification individuelle pour chaque utilisateur
                $user->notifications()->create([
                    'title' => $this->title,
                    'message' => $this->message,
                    'type' => $this->type,
                    'data' => [
                        'admin_notification_id' => $this->id,
                        'target' => $this->target,
                    ],
                ]);
            }

            // Mettre à jour les stats
            $this->update([
                'status' => 'sent',
                'sent_at' => now(),
                'recipients_count' => $recipients->count(),
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('Erreur envoi notification admin: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Récupérer les destinataires selon la cible
     */
    private function getRecipients()
    {
        switch ($this->target) {
            case 'all':
                return User::where('status', 'active')->get();
            case 'users':
                return User::where('role', 'student')->where('status', 'active')->get();
            case 'creators':
                return User::where('role', 'creator')->where('status', 'active')->get();
            case 'admins':
                return User::where('role', 'admin')->where('status', 'active')->get();
            default:
                return collect();
        }
    }

    /**
     * Programmer l'envoi
     */
    public function schedule(\DateTime $scheduledAt): bool
    {
        return $this->update([
            'status' => 'scheduled',
            'scheduled_at' => $scheduledAt,
        ]);
    }
}
