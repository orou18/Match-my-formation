<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoViewEvent extends Model
{
    protected $fillable = [
        'video_id',
        'user_id',
        'employee_id',
        'watch_time_seconds',
        'duration_seconds',
        'progress_percentage',
        'event_type',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
