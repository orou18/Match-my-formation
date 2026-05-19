<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminWebinar extends Model
{
    protected $fillable = [
        'title',
        'description',
        'speaker',
        'starts_at',
        'duration_minutes',
        'status',
        'registered_users',
        'max_participants',
        'category',
        'thumbnail',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
    ];
}
