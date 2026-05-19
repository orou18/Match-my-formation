<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminAd extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'starts_at',
        'ends_at',
        'budget',
        'impressions',
        'clicks',
        'target_audience',
        'image',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'budget' => 'decimal:2',
    ];
}
