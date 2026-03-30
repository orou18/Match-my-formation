<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'video_id',
        'message',
        'status',    // 'pending', 'answered', 'resolved'
        'reply_to',  // Pour les réponses du creator
        'is_question', // Booléen si c'est une question
        'likes_count',
    ];

    protected $casts = [
        'is_question' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation: Message appartient à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation: Message appartient à une vidéo
     */
    public function video()
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Relation: Réponses à ce message (pour questions)
     */
    public function replies()
    {
        return $this->hasMany(ChatMessage::class, 'reply_to');
    }

    /**
     * Relation: Parent du message (si réponse)
     */
    public function parentMessage()
    {
        return $this->belongsTo(ChatMessage::class, 'reply_to');
    }

    /**
     * Scope: Messages non répondus (questions)
     */
    public function scopePending($query)
    {
        return $query->where('is_question', true)
            ->where('status', '!=', 'resolved');
    }

    /**
     * Scope: Questions uniquement
     */
    public function scopeQuestions($query)
    {
        return $query->where('is_question', true);
    }

    /**
     * Scope: Pour une vidéo spécifique
     */
    public function scopeForVideo($query, $videoId)
    {
        return $query->where('video_id', $videoId)
            ->orderBy('created_at', 'desc');
    }
}
